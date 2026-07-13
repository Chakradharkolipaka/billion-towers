const Product = require("../models/productModel");
const asyncErrorHandler = require("../middlewares/helpers/asyncErrorHandler");
const SearchFeatures = require("../utils/searchFeatures");
const ErrorHandler = require("../utils/errorHandler");
const {
  buildProductImages,
  buildBrand,
  applyProductDefaults,
  destroyProductAssets,
  recalculateRatings,
  pickUpdatableFields,
  parseSpecifications,
} = require("../utils/productHelpers");
const { destroyImage } = require("../utils/mediaUpload");
const {
  mergeDetailsFromBody,
  mergeDetailsSection,
  syncDetailsToProductUpdate,
  buildDetailsResponse,
  normalizeProductDetails,
  defaultProductDetails,
} = require("../utils/productDetailsHelpers");

const sendProductList = async (query, req, res) => {
  const resultPerPage = Number(req.query.limit) || 12;
  const productsCount = await Product.countDocuments();

  const searchFeature = new SearchFeatures(query, req.query).search().filter();

  let products = await searchFeature.query;
  const filteredProductsCount = products.length;

  searchFeature.pagination(resultPerPage);
  products = await searchFeature.query.clone();

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
};

// READ — paginated public list
exports.getAllProducts = asyncErrorHandler(async (req, res, next) => {
  await sendProductList(Product.find(), req, res);
});

// READ — all products (marketplace / sliders)
exports.getProducts = asyncErrorHandler(async (req, res, next) => {
  const products = await Product.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    products,
    count: products.length,
  });
});

// READ — single public product
exports.getProductDetails = asyncErrorHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    product: req.resource,
    details: buildDetailsResponse(req.resource),
  });
});

// READ — admin list with optional filters
exports.getAdminProducts = asyncErrorHandler(async (req, res, next) => {
  await sendProductList(Product.find().populate("user", "name email"), req, res);
});

// READ — single admin product
exports.getAdminProductById = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.resource._id).populate(
    "user",
    "name email role",
  );

  res.status(200).json({
    success: true,
    product,
  });
});

// CREATE
exports.createProduct = asyncErrorHandler(async (req, res, next) => {
  const payload = applyProductDefaults(req.body);

  payload.images = await buildProductImages(payload.images);
  payload.brand = await buildBrand(payload.logo, payload.brandname);
  payload.user = req.user._id;

  delete payload.logo;
  delete payload.brandname;

  if (req.body.details) {
    const mergedDetails = mergeDetailsFromBody(req.body.details);
    const synced = syncDetailsToProductUpdate(mergedDetails);
    payload.details = synced.details;
    payload.specifications = synced.specifications;
    payload.stock = synced.stock;
  }

  const product = await Product.create(payload);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
});

// UPDATE — full replace of editable fields
exports.updateProduct = asyncErrorHandler(async (req, res, next) => {
  const product = req.resource;
  const updates = pickUpdatableFields(req.body);

  if (req.body.images !== undefined) {
    await destroyProductAssets({ images: product.images });
    updates.images = await buildProductImages(req.body.images);
  }

  if (req.body.logo) {
    await destroyImage(product.brand?.logo?.public_id);
    updates.brand = await buildBrand(
      req.body.logo,
      req.body.brandname,
      product.brand?.name,
    );
  } else if (req.body.brandname) {
    updates.brand = {
      ...product.brand.toObject(),
      name: req.body.brandname,
    };
  }

  if (updates.specifications) {
    updates.specifications = parseSpecifications(updates.specifications);
  }

  updates.user = req.user._id;

  const updatedProduct = await Product.findByIdAndUpdate(
    product._id,
    updates,
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product: updatedProduct,
  });
});

// UPDATE — partial patch
exports.patchProduct = asyncErrorHandler(async (req, res, next) => {
  const product = req.resource;
  const updates = pickUpdatableFields(req.body);

  if (!Object.keys(updates).length && req.body.images === undefined && !req.body.logo) {
    return next(new ErrorHandler("No valid fields provided to update", 400));
  }

  if (req.body.images !== undefined) {
    await destroyProductAssets({ images: product.images });
    updates.images = await buildProductImages(req.body.images);
  }

  if (req.body.logo) {
    await destroyImage(product.brand?.logo?.public_id);
    updates.brand = await buildBrand(
      req.body.logo,
      req.body.brandname,
      product.brand?.name,
    );
  } else if (req.body.brandname) {
    updates.brand = {
      ...product.brand.toObject(),
      name: req.body.brandname,
    };
  }

  if (updates.specifications) {
    updates.specifications = parseSpecifications(updates.specifications);
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    product._id,
    updates,
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    success: true,
    message: "Product patched successfully",
    product: updatedProduct,
  });
});

// DELETE — single product
exports.deleteProduct = asyncErrorHandler(async (req, res, next) => {
  const product = req.resource;

  await destroyProductAssets(product);
  await Product.findByIdAndDelete(product._id);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

// DELETE — bulk products (admin)
exports.deleteProducts = asyncErrorHandler(async (req, res, next) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || !ids.length) {
    return next(new ErrorHandler("Provide an array of product ids to delete", 400));
  }

  const products = await Product.find({ _id: { $in: ids } });

  if (!products.length) {
    return next(new ErrorHandler("No matching products found", 404));
  }

  for (const product of products) {
    await destroyProductAssets(product);
  }

  await Product.deleteMany({ _id: { $in: products.map((item) => item._id) } });

  res.status(200).json({
    success: true,
    message: `${products.length} product(s) deleted successfully`,
    deletedCount: products.length,
  });
});

// DETAILS — read public detailed info
exports.getProductDetailedInfo = asyncErrorHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    ...buildDetailsResponse(req.resource),
  });
});

// DETAILS — read admin detailed info
exports.getAdminProductDetailedInfo = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.resource._id).populate(
    "user",
    "name email role",
  );

  res.status(200).json({
    success: true,
    ...buildDetailsResponse(product),
    product,
  });
});

// DETAILS — create or replace all detailed info
exports.upsertProductDetailedInfo = asyncErrorHandler(async (req, res, next) => {
  const product = req.resource;
  const mergedDetails = mergeDetailsFromBody(req.body, product);
  const synced = syncDetailsToProductUpdate(mergedDetails);

  const updatedProduct = await Product.findByIdAndUpdate(
    product._id,
    synced,
    { new: true, runValidators: true },
  );

  res.status(200).json({
    success: true,
    message: "Product detailed info saved successfully",
    ...buildDetailsResponse(updatedProduct),
    product: updatedProduct,
  });
});

// DETAILS — partial update across sections
exports.patchProductDetailedInfo = asyncErrorHandler(async (req, res, next) => {
  const product = req.resource;
  const mergedDetails = mergeDetailsFromBody(req.body, product);
  const synced = syncDetailsToProductUpdate(mergedDetails);

  const updatedProduct = await Product.findByIdAndUpdate(
    product._id,
    synced,
    { new: true, runValidators: true },
  );

  res.status(200).json({
    success: true,
    message: "Product detailed info updated successfully",
    ...buildDetailsResponse(updatedProduct),
    product: updatedProduct,
  });
});

// DETAILS — update a single section (location | investment | property | financials)
exports.updateProductDetailsSection = asyncErrorHandler(async (req, res, next) => {
  const product = req.resource;
  const { section } = req.params;
  const mergedDetails = mergeDetailsSection(section, req.body, product);
  const synced = syncDetailsToProductUpdate(mergedDetails);

  const updatedProduct = await Product.findByIdAndUpdate(
    product._id,
    synced,
    { new: true, runValidators: true },
  );

  res.status(200).json({
    success: true,
    message: `Product ${section} details updated successfully`,
    section,
    ...buildDetailsResponse(updatedProduct),
    product: updatedProduct,
  });
});

// DETAILS — reset detailed info to defaults
exports.clearProductDetailedInfo = asyncErrorHandler(async (req, res, next) => {
  const product = req.resource;
  const synced = syncDetailsToProductUpdate(defaultProductDetails());

  const updatedProduct = await Product.findByIdAndUpdate(
    product._id,
    synced,
    { new: true, runValidators: true },
  );

  res.status(200).json({
    success: true,
    message: "Product detailed info reset to defaults",
    ...buildDetailsResponse(updatedProduct),
    product: updatedProduct,
  });
});

// DETAILS — summary stats for admin dashboard
exports.getProductDetailsSummary = asyncErrorHandler(async (req, res, next) => {
  const products = await Product.find().select("details specifications stock category name");

  const summary = products.map((product) => {
    const details = normalizeProductDetails(product);
    return {
      productId: product._id,
      name: product.name,
      category: product.category,
      status: details.property.status,
      city: details.location.city,
      totalShares: details.investment.totalShares,
      availableShares: details.investment.availableShares,
      investors: details.investment.investors,
      projectedRoi: details.investment.projectedRoi,
      verified: details.property.verified,
      isFeatured: details.property.isFeatured,
    };
  });

  res.status(200).json({
    success: true,
    count: summary.length,
    summary,
  });
});

// REVIEWS — create or update
exports.createProductReview = asyncErrorHandler(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  const existingReview = product.reviews.find(
    (item) => item.user.toString() === req.user._id.toString(),
  );

  if (existingReview) {
    existingReview.rating = Number(rating);
    existingReview.comment = comment;
  } else {
    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    });
  }

  const { ratings, numOfReviews } = recalculateRatings(product.reviews);
  product.ratings = ratings;
  product.numOfReviews = numOfReviews;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: existingReview ? "Review updated" : "Review added",
    ratings,
    numOfReviews,
  });
});

// REVIEWS — list for product
exports.getProductReviews = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.id).select("reviews ratings numOfReviews");

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
    ratings: product.ratings,
    numOfReviews: product.numOfReviews,
  });
});

// REVIEWS — delete
exports.deleteReview = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  const review = product.reviews.find(
    (item) => item._id.toString() === req.query.id.toString(),
  );

  if (!review) {
    return next(new ErrorHandler("Review Not Found", 404));
  }

  const isOwner = review.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return next(new ErrorHandler("Not authorized to delete this review", 403));
  }

  const reviews = product.reviews.filter(
    (item) => item._id.toString() !== req.query.id.toString(),
  );

  const { ratings, numOfReviews } = recalculateRatings(reviews);

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});
