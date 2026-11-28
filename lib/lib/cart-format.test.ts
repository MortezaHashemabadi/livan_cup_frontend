import { describe, it, expect } from "vitest";
import { formatItemSpecs } from "./cart-format";

describe("formatItemSpecs", () => {
  it("lists options, single fabric color and custom print color", () => {
    const specs = formatItemSpecs({
      selected_options: [
        { group_name: "نوع دستگیره", choice_name: "زنبیلی" },
        { group_name: "رنگ چاپ", choice_name: "معمولی" },
      ],
      fabric_color: "مشکی",
      print_color: "قرمز",
    });
    expect(specs).toEqual([
      "نوع دستگیره: زنبیلی",
      "رنگ چاپ: معمولی",
      "رنگ پارچه: مشکی",
      "رنگ چاپ دلخواه: قرمز",
    ]);
  });

  it("shows top and bottom colors instead of the single fabric color", () => {
    const specs = formatItemSpecs({
      fabric_color: "ignored",
      top_color: "مشکی",
      bottom_color: "سفید",
    });
    expect(specs).toEqual(["رنگ بالا: مشکی", "رنگ پایین: سفید"]);
  });

  it("returns empty list when there is nothing to show", () => {
    expect(formatItemSpecs({})).toEqual([]);
  });
});
