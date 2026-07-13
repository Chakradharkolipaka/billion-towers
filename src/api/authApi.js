import { request } from "./client";

export function login(email, password) {
  return request({
    method: "POST",
    url: "/api/user/login",
    data: { email, password },
  });
}

export function register(payload) {
  return request({
    method: "POST",
    url: "/api/user/register",
    data: payload,
  });
}

export function logout() {
  return request({
    method: "GET",
    url: "/api/user/logout",
  });
}

export function getMe() {
  return request({
    method: "GET",
    url: "/api/user/me",
  });
}

export function updatePassword(oldPassword, newPassword) {
  return request({
    method: "PUT",
    url: "/api/user/password/update",
    data: { oldPassword, newPassword },
  });
}

export function updateProfile(payload) {
  return request({
    method: "PUT",
    url: "/api/user/me/update",
    data: payload,
  });
}

export function forgotPassword(email) {
  return request({
    method: "POST",
    url: "/api/user/password/forgot",
    data: { email },
  });
}

export function getAllUsers() {
  return request({
    method: "GET",
    url: "/api/user/admin/users",
  });
}
