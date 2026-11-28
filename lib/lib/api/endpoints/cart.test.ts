import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../client", () => ({
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

import { api } from "../client";
import { cartApi } from "./cart";

const post = api.post as unknown as ReturnType<typeof vi.fn>;

describe("cartApi.addItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    post.mockResolvedValue({});
  });

  it("sends each option id as its own multipart field when a file is attached", async () => {
    const file = new File(["x"], "logo.png", { type: "image/png" });
    await cartApi.addItem({
      variant: 7,
      quantity: 1000,
      print_file: file,
      selected_option_ids: [3, 9],
      top_color: "مشکی",
      bottom_color: "سفید",
    });

    const [path, body, options] = post.mock.calls[0];
    expect(path).toBe("/cart/items/");
    expect(options).toEqual({ isFormData: true });
    const form = body as FormData;
    expect(form.getAll("selected_option_ids")).toEqual(["3", "9"]);
    expect(form.get("variant")).toBe("7");
    expect(form.get("quantity")).toBe("1000");
    expect(form.get("top_color")).toBe("مشکی");
    expect(form.get("bottom_color")).toBe("سفید");
  });

  it("sends JSON (with option ids as an array) when there is no file", async () => {
    await cartApi.addItem({
      variant: 7,
      quantity: 1000,
      selected_option_ids: [3, 9],
      fabric_color: "مشکی",
    });

    const [path, body] = post.mock.calls[0];
    expect(path).toBe("/cart/items/");
    expect(body).toEqual({
      variant: 7,
      quantity: 1000,
      selected_option_ids: [3, 9],
      fabric_color: "مشکی",
    });
  });
});
