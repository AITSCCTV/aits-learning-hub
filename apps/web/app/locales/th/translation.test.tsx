import { act, render, screen } from "@testing-library/react";
import { createInstance } from "i18next";
import { I18nextProvider } from "react-i18next";
import { describe, expect, it } from "vitest";

import { LocalizedText } from "~/components/LocalizedText";
import en from "~/locales/en/translation.json";
import th from "~/locales/th/translation.json";
import { useLanguageStore } from "~/modules/Dashboard/Settings/Language/LanguageStore";
import { getDateLocale } from "~/utils/getDateLocale";

function flatten(value: Record<string, unknown>, prefix = ""): Record<string, string> {
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, entry]) => {
      const path = `${prefix}${key}`;
      if (typeof entry === "string") return [[path, entry]];
      return Object.entries(flatten(entry as Record<string, unknown>, `${path}.`));
    }),
  );
}

describe("Thai interface coverage", () => {
  it("covers every English key and preserves interpolations and markup", () => {
    const english = flatten(en);
    const thai = flatten(th);
    expect(Object.keys(thai).sort()).toEqual(Object.keys(english).sort());
    for (const [key, source] of Object.entries(english)) {
      expect(thai[key].trim(), key).not.toBe("");
      const tokens = (text: string) =>
        [...text.matchAll(/\{\{.*?\}\}|<\/?[^>]+>/g)].map(([token]) => token).sort();
      expect(tokens(thai[key]), key).toEqual(tokens(source));
      const prose = thai[key].replace(/\{\{.*?\}\}|https?:\/\/\S+|\S+@\S+|<\/?[^>]+>/g, "");
      const identifiers = [
        "Google OAuth",
        "OpenAI",
        "PDF",
        "SCORM",
        "SCORM 1.2",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxx",
      ];
      if (/[a-zA-Z]{3}/.test(prose) && !identifiers.includes(prose)) {
        expect(prose, key).toMatch(/[\u0e00-\u0e7f]/);
      }
    }
  });

  it("changes shared controls immediately when switching between Thai and English", async () => {
    const instance = createInstance();
    await instance.init({
      lng: "th",
      resources: { en: { translation: en }, th: { translation: th } },
    });
    render(
      <I18nextProvider i18n={instance}>
        <LocalizedText textKey="interface.close" />
      </I18nextProvider>,
    );
    expect(screen.getByText("ปิด")).toBeInTheDocument();
    await act(() => instance.changeLanguage("en"));
    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  it("starts in Thai and preserves explicitly selected and account languages", () => {
    expect(useLanguageStore.getInitialState().language).toBe("th");
    useLanguageStore.getState().setLanguage("en");
    expect(useLanguageStore.getState().initializeLanguage()).toBe("en");
    expect(useLanguageStore.getState().initializeLanguage("th")).toBe("th");
    expect(getDateLocale("th-TH").code).toBe("th");
  });
});
