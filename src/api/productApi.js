import { request } from "./client";

export function getAllProducts() {
  return request({
    method: "GET",
    url: "/api/product/products/all",
  });
}

export function getProducts(params) {
  return request({
    method: "GET",
    url: "/api/product/products",
    params,
  });
}

export function getProduct(id) {
  return request({
    method: "GET",
    url: `/api/product/product/${id}`,
  });
}

export function getAdminProducts() {
  return request({
    method: "GET",
    url: "/api/product/admin/products",
  });
}

export function getAdminProduct(id) {
  return request({
    method: "GET",
    url: `/api/product/admin/product/${id}`,
  });
}

export function createProduct(payload) {
  return request({
    method: "POST",
    url: "/api/product/admin/products",
    data: payload,
  });
}

export function patchProduct(id, payload) {
  return request({
    method: "PATCH",
    url: `/api/product/admin/product/${id}`,
    data: payload,
  });
}

export function getProductDetailsInfo(id) {
  return request({
    method: "GET",
    url: `/api/product/product/${id}/details`,
  });
}

export function getAdminProductDetails(id) {
  return request({
    method: "GET",
    url: `/api/product/admin/product/${id}/details`,
  });
}

export function upsertProductDetails(id, details) {
  return request({
    method: "PUT",
    url: `/api/product/admin/product/${id}/details`,
    data: details,
  });
}

export function patchProductDetails(id, details) {
  return request({
    method: "PATCH",
    url: `/api/product/admin/product/${id}/details`,
    data: details,
  });
}

export function updateProductDetailsSection(id, section, payload) {
  return request({
    method: "PATCH",
    url: `/api/product/admin/product/${id}/details/${section}`,
    data: payload,
  });
}

export function clearProductDetails(id) {
  return request({
    method: "DELETE",
    url: `/api/product/admin/product/${id}/details`,
  });
}

export function getProductDetailsSummary() {
  return request({
    method: "GET",
    url: "/api/product/admin/products/details/summary",
  });
}

export function updateProduct(id, payload) {
  return request({
    method: "PUT",
    url: `/api/product/admin/product/${id}`,
    data: payload,
  });
}

export function deleteProduct(id) {
  return request({
    method: "DELETE",
    url: `/api/product/admin/product/${id}`,
  });
}

export function deleteProducts(ids) {
  return request({
    method: "POST",
    url: "/api/product/admin/products/bulk-delete",
    data: { ids },
  });
}
