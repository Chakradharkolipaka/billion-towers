const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please enter product description"],
  },
  highlights: [
    {
      type: String,
      required: true,
    },
  ],
  specifications: [
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
  ],
  price: {
    type: Number,
    required: [true, "Please enter product price"],
  },
  cuttedPrice: {
    type: Number,
    required: [true, "Please enter cutted price"],
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  brand: {
    name: {
      type: String,
      required: true,
    },
    logo: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  },
  category: {
    type: String,
    required: [true, "Please enter product category"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter product stock"],
    maxlength: [4, "Stock cannot exceed limit"],
    default: 1,
  },
  warranty: {
    type: Number,
    default: 1,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  details: {
    location: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true, default: "USA" },
      address: { type: String, trim: true },
    },
    investment: {
      totalShares: { type: Number, default: 1000, min: 1 },
      availableShares: { type: Number, min: 0 },
      investors: { type: Number, default: 0, min: 0 },
      targetYield: { type: Number, default: 8, min: 0 },
      projectedRoi: { type: Number, default: 10, min: 0 },
      occupancyPercent: { type: Number, min: 0, max: 100 },
    },
    property: {
      status: {
        type: String,
        enum: ["active", "pending", "sold", "draft"],
        default: "active",
      },
      yearBuilt: { type: Number },
      squareFootage: { type: Number, min: 0 },
      bedrooms: { type: Number, min: 0 },
      bathrooms: { type: Number, min: 0 },
      verified: { type: Boolean, default: true },
      isFeatured: { type: Boolean, default: false },
    },
    financials: {
      monthlyRent: { type: Number, min: 0 },
      annualYield: { type: Number, min: 0 },
      expenses: { type: Number, min: 0 },
      netIncome: { type: Number, min: 0 },
    },
  },
  blockchainListing: {
    listingId: { type: Number },
    tokenAddress: { type: String },
    tokensMinted: { type: Number, default: 0 },
    tokensListed: { type: Number, default: 0 },
    seller: { type: String },
    pricePerUnit: { type: String },
    listed: { type: Boolean, default: false },
    listedAt: { type: Date },
    transactionHash: { type: String },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
