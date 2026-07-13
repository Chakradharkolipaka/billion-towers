const express = require("express");
const {
  getAllProducts,
  getProductDetails,
  getProductDetailedInfo,
  getAdminProductDetailedInfo,
  upsertProductDetailedInfo,
  patchProductDetailedInfo,
  updateProductDetailsSection,
  clearProductDetailedInfo,
  getProductDetailsSummary,
  updateProduct,
  patchProduct,
  deleteProduct,
  deleteProducts,
  getProductReviews,
  deleteReview,
  createProductReview,
  createProduct,
  getAdminProducts,
  getAdminProductById,
  getProducts,
} = require("../controllers/productController");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/user_actions/auth");
const {
  validateCreateProduct,
  validateUpdateProduct,
  validatePatchProduct,
  validateBulkDeleteProducts,
  validateProductIdParam,
  validateCreateReview,
  validateDeleteReview,
  validateProductReviewsQuery,
  validateProductDetailsParam,
  validateUpsertProductDetails,
  validatePatchProductDetailsSection,
} = require("../middlewares/validate");
const { verifyProductExists } = require("../middlewares/auth/ownership");
const { ROLES } = require("../constants/roles");

const router = express.Router();

// Public READ
router.route("/products").get(getAllProducts);
router.route("/products/all").get(getProducts);
router
  .route("/product/:id")
  .get(validateProductIdParam, verifyProductExists, getProductDetails);

router
  .route("/product/:id/details")
  .get(validateProductDetailsParam, verifyProductExists, getProductDetailedInfo);

// Admin CRUD
router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles(ROLES.ADMIN), getAdminProducts)
  .post(
    isAuthenticatedUser,
    authorizeRoles(ROLES.ADMIN),
    validateCreateProduct,
    createProduct,
  );

router
  .route("/admin/products/bulk-delete")
  .post(
    isAuthenticatedUser,
    authorizeRoles(ROLES.ADMIN),
    validateBulkDeleteProducts,
    deleteProducts,
  );

router
  .route("/admin/product/:id")
  .get(
    isAuthenticatedUser,
    authorizeRoles(ROLES.ADMIN),
    validateProductIdParam,
    verifyProductExists,
    getAdminProductById,
  )
  .put(
    isAuthenticatedUser,
    authorizeRoles(ROLES.ADMIN),
    validateUpdateProduct,
    verifyProductExists,
    updateProduct,
  )
  .patch(
    isAuthenticatedUser,
    authorizeRoles(ROLES.ADMIN),
    validatePatchProduct,
    verifyProductExists,
    patchProduct,
  )
  .delete(
    isAuthenticatedUser,
    authorizeRoles(ROLES.ADMIN),
    validateProductIdParam,
    verifyProductExists,
    deleteProduct,
  );

router
  .route("/admin/products/details/summary")
  .get(
    isAuthenticatedUser,
    authorizeRoles(ROLES.ADMIN),
    getProductDetailsSummary,
  );

router
  .route("/admin/product/:id/details")
  .get(
    isAuthenticatedUser,
    authorizeRoles(ROLES.ADMIN),
    validateProductDetailsParam,
    verifyProductExists,
    getAdminProductDetailedInfo,
  )
  .put(
    isAuthenticatedUser,
    authorizeRoles(ROLES.ADMIN),
    validateUpsertProductDetails,
    verifyProductExists,
    upsertProductDetailedInfo,
  )
  .patch(
    isAuthenticatedUser,
    authorizeRoles(ROLES.ADMIN),
    validateUpsertProductDetails,
    verifyProductExists,
    patchProductDetailedInfo,
  )
  .delete(
    isAuthenticatedUser,
    authorizeRoles(ROLES.ADMIN),
    validateProductDetailsParam,
    verifyProductExists,
    clearProductDetailedInfo,
  );

router
  .route("/admin/product/:id/details/:section")
  .patch(
    isAuthenticatedUser,
    authorizeRoles(ROLES.ADMIN),
    validatePatchProductDetailsSection,
    verifyProductExists,
    updateProductDetailsSection,
  );

// Legacy create route (backward compatible)
router
  .route("/admin/product/new")
  .post(
    isAuthenticatedUser,
    authorizeRoles(ROLES.ADMIN),
    validateCreateProduct,
    createProduct,
  );

// Reviews
router
  .route("/review")
  .put(isAuthenticatedUser, validateCreateReview, createProductReview);

router
  .route("/admin/reviews")
  .get(
    isAuthenticatedUser,
    authorizeRoles(ROLES.ADMIN),
    validateProductReviewsQuery,
    getProductReviews,
  )
  .delete(isAuthenticatedUser, validateDeleteReview, deleteReview);

module.exports = router;
