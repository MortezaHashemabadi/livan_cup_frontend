import { describe, it, expect } from "vitest";
import { getApiErrorMessage } from "./errors";
import { ApiError } from "./types";

describe("getApiErrorMessage", () => {
  it("reads detail", () => {
    const err = new ApiError(400, { detail: "حداقل سفارش 1000 عدد است" });
    expect(getApiErrorMessage(err, "fallback")).toBe("حداقل سفارش 1000 عدد است");
  });

  it("reads non_field_errors", () => {
    const err = new ApiError(400, { non_field_errors: ["رنگ بالا و پایین لازم است"] });
    expect(getApiErrorMessage(err, "fallback")).toBe("رنگ بالا و پایین لازم است");
  });

  it("joins field errors", () => {
    const err = new ApiError(400, { quantity: ["الف"], variant: ["ب"] });
    expect(getApiErrorMessage(err, "fallback")).toBe("الف؛ ب");
  });

  it("uses fallback for server errors and unknown errors", () => {
    expect(getApiErrorMessage(new ApiError(500, { detail: "Internal" }), "fb")).toBe("fb");
    expect(getApiErrorMessage(new Error("x"), "fb")).toBe("fb");
    expect(getApiErrorMessage(new ApiError(400, {}), "fb")).toBe("fb");
  });

  it("shows a Persian message for throttling", () => {
    const err = new ApiError(429, { detail: "Request was throttled." });
    expect(getApiErrorMessage(err, "fb")).toContain("تعداد درخواست");
  });
});
