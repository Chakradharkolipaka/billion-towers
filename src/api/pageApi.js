import { request } from "./client";

export function getPage(key) {
  return request({
    method: "GET",
    url: `/api/pages/${key}`,
  });
}

export function getPages() {
  return request({
    method: "GET",
    url: "/api/pages",
  });
}
