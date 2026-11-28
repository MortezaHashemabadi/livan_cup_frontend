import { describe, it, expect } from "vitest";
import { resolveMediaUrl } from "./media";

describe("resolveMediaUrl", () => {
  it("keeps absolute urls untouched", () => {
    expect(resolveMediaUrl("https://iranlivan.ir/media/a.png")).toBe(
      "https://iranlivan.ir/media/a.png",
    );
    expect(resolveMediaUrl("http://127.0.0.1:8000/media/a.png")).toBe(
      "http://127.0.0.1:8000/media/a.png",
    );
    expect(resolveMediaUrl("blob:abc")).toBe("blob:abc");
  });

  it("prefixes relative urls exactly once", () => {
    const withSlash = resolveMediaUrl("/media/a.png");
    const withoutSlash = resolveMediaUrl("media/a.png");
    expect(withSlash).toMatch(/^https?:\/\/[^/]+\/media\/a\.png$/);
    expect(withoutSlash).toBe(withSlash);
  });

  it("returns undefined for empty values", () => {
    expect(resolveMediaUrl(null)).toBeUndefined();
    expect(resolveMediaUrl("")).toBeUndefined();
  });
});
