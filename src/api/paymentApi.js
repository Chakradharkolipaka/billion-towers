import { request } from "./client";

export function processPayment(payload) {
  return request({
    method: "POST",
    url: "/api/payment/payment/process",
    data: payload,
  });
}

export function createInvestment(payload) {
  return request({
    method: "POST",
    url: "/api/payment/investment",
    data: payload,
  });
}

export function getPaymentStatus(orderId) {
  return request({
    method: "GET",
    url: `/api/payment/payment/status/${orderId}`,
  });
}
