import { describe, expect, it } from "vitest";

import { getSampleKind } from "./SamplePlaceholder";

describe("administrator-replaceable sample markers", () => {
  it("recognizes supported sample formats in stored lesson HTML", () => {
    for (const kind of ["video", "slides", "pdf", "text", "image", "faq", "sop"])
      expect(getSampleKind(`<p>[AITS:${kind}]</p>`)).toBe(kind);
  });
  it("stops displaying the placeholder when an editor removes its marker", () => {
    expect(getSampleKind('<p>Approved material</p><video src="/resource" />')).toBeUndefined();
    expect(getSampleKind("[AITS:unknown]")).toBeUndefined();
  });
});
