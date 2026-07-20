const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const ErrorHandler = require("./utils/errorHandler");
const orderRouter = require("./routes/orderRoute");
const paymentRouter = require("./routes/paymentRoute");
const productRouter = require("./routes/productRoute");
const userRouter = require("./routes/userRoute");
const pageRouter = require("./routes/pageRoute");

const app = express();

// Log and handle large headers
app.use((req, res, next) => {
  const headerSize = JSON.stringify(req.headers).length;
  if (headerSize > 50000) {
    console.warn(`[app] Large header detected: ${headerSize} bytes from ${req.path}`);
  }
  next();
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL || true,
    credentials: true,
  }),
);
app.options(
  "*",
  cors({ origin: process.env.FRONTEND_URL || true, credentials: true }),
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use("/api/order", orderRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/product", productRouter);
app.use("/api/user", userRouter);
app.use("/api/pages", pageRouter);

app.get("/api/health", (req, res) => {
  const mongoose = require("mongoose");
  res.status(200).json({
    success: true,
    message: "API is running",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/placeholder/:width/:height", (req, res) => {
  const { width, height } = req.params;
  res.redirect(
    `https://via.placeholder.com/${width}x${height}?text=Property+Image&bg=efefef&fg=555555`,
  );
});

// deployment
const rootDir = path.resolve(__dirname, "..");
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(rootDir, "build")));

  app.get("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api")) {
      return next(new ErrorHandler("API route not found", 404));
    }
    res.sendFile(path.resolve(rootDir, "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Server is Running! 🚀");
  });
}

app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return next(new ErrorHandler("API route not found", 404));
  }
  next();
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  if (err.name === "ValidationError") {
    err.statusCode = 400;
    err.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  }

  if (err.code === 11000) {
    err.statusCode = 400;
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    err.message = `Duplicate value for ${field}`;
  }

  if (err.name === "CastError") {
    err.statusCode = 400;
    err.message = `Invalid ${err.path || "identifier"}`;
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
});

module.exports = app;
