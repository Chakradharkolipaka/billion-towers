const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Product = require("../models/productModel");

const seedProperties = require("../data/seedProperties.json");

const DEFAULT_ADMIN = {
  name: "Billion Towers Admin",
  email: process.env.SEED_ADMIN_EMAIL || "admin@billiontowers.demo",
  gender: "other",
  password: process.env.SEED_ADMIN_PASSWORD || "Admin@12345",
  role: "admin",
};

function propertyToProductDoc(property, adminId) {
  const images = (property.images || []).map((url, index) => ({
    public_id: `seed_property_${property.id}_${index}`,
    url,
  }));

  return {
    name: property.name,
    description: property.description,
    highlights: property.features || [],
    specifications: [
      { title: "City", description: property.location?.city || "" },
      { title: "State", description: property.location?.state || "" },
      { title: "Country", description: property.location?.country || "USA" },
      { title: "Total Shares", description: String(property.totalShares || 1000) },
      {
        title: "Available Shares",
        description: String(property.availableShares || 0),
      },
      { title: "Investors", description: String(property.investors || 0) },
      { title: "Target Yield", description: String(property.profit || 8) },
      {
        title: "Projected ROI",
        description: String(property.projectedRoi || property.returns || 10),
      },
      {
        title: "Occupancy",
        description: String(property.occupancyPercent || 0),
      },
    ],
    price: property.price,
    cuttedPrice: property.price,
    images,
    brand: {
      name: "Billion Towers",
      logo: {
        public_id: "seed_brand_logo",
        url: "https://via.placeholder.com/150?text=BT",
      },
    },
    category: property.category,
    stock: property.availableShares || 1,
    user: adminId,
    details: {
      location: {
        city: property.location?.city,
        state: property.location?.state,
        country: property.location?.country || "USA",
      },
      investment: {
        totalShares: property.totalShares || 1000,
        availableShares: property.availableShares || 0,
        investors: property.investors || 0,
        targetYield: property.profit || 8,
        projectedRoi: property.projectedRoi || property.returns || 10,
        occupancyPercent: property.occupancyPercent,
      },
      property: {
        status: property.status || "active",
        yearBuilt: property.yearBuilt,
        squareFootage: property.squareFootage,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        verified: property.verified !== false,
        isFeatured: Boolean(property.isFeatured),
      },
      financials: property.financials || {},
    },
    createdAt: property.createdAt ? new Date(property.createdAt) : new Date(),
  };
}

async function ensureAdminUser() {
  let admin = await User.findOne({
    $or: [{ role: "admin" }, { email: DEFAULT_ADMIN.email }],
  });

  if (admin) {
    if (admin.role !== "admin") {
      admin.role = "admin";
      console.log(`Promoted existing user to admin: ${admin.email}`);
    } else {
      console.log(`Admin user already exists: ${admin.email}`);
    }
    // Force reset password to recover from double-hashing bug
    admin.password = DEFAULT_ADMIN.password;
    await admin.save();
    console.log(`Reset admin password to default: ${DEFAULT_ADMIN.password}`);
    return admin;
  }

  admin = await User.create({
    ...DEFAULT_ADMIN,
    avatar: {
      public_id: "default_avatar",
      url: "https://via.placeholder.com/150?text=BT",
    },
  });

  console.log(`Created seed admin user: ${admin.email}`);
  console.log(`Demo admin password: ${DEFAULT_ADMIN.password}`);
  return admin;
}

async function ensureProducts(adminId) {
  const existingCount = await Product.countDocuments();
  if (existingCount > 0) {
    console.log(`Products collection ready (${existingCount} documents).`);
    return;
  }

  const docs = seedProperties.map((property) =>
    propertyToProductDoc(property, adminId),
  );

  await Product.insertMany(docs);
  console.log(`Seeded ${docs.length} marketplace products.`);
}

async function seedDatabase() {
  const admin = await ensureAdminUser();
  await ensureProducts(admin._id);

  const collections = await mongoose.connection.db.listCollections().toArray();
  const names = collections.map((collection) => collection.name).sort();
  console.log("MongoDB collections:", names.join(", ") || "(none yet)");
}

module.exports = seedDatabase;

if (require.main === module) {
  const mongoose = require("mongoose");
  const envPath = fs.existsSync(path.join(__dirname, "config.env"))
    ? path.join(__dirname, "config.env")
    : path.join(__dirname, "..", "..", ".env");

  require("dotenv").config({ path: envPath });

  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => seedDatabase())
    .then(() => mongoose.disconnect())
    .catch((error) => {
      console.error("Seed failed:", error.message);
      process.exit(1);
    });
}
