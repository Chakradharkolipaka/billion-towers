const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  propertyId: {
    type: String,
    required: true,
  },
  propertyName: {
    type: String,
    required: true,
  },
  shares: {
    type: Number,
    required: true,
    min: 1,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  method: {
    type: String,
    enum: ["wallet", "card", "bank", "google_pay", "apple_pay"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "failed"],
    default: "pending",
  },
  walletAddress: String,
  email: {
    type: String,
    required: true,
  },
  phone: String,
  paymentMeta: {
    type: mongoose.Schema.Types.Mixed,
  },
  transactionRef: {
    type: String,
    unique: true,
    sparse: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Investment", investmentSchema);
