import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { calculatePoeLoad } from "./visual-learning.data";
import VisualLearning from "./VisualLearning";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

beforeEach(() => localStorage.clear());

describe("bilingual visual learning", () => {
  it("does not award progress for a wrong answer and restores correct practice for this user only", () => {
    const view = render(<VisualLearning userId="learner-a" />);
    fireEvent.click(screen.getByRole("button", { name: /visualLearning.begin/ }));
    expect(screen.getByText("งานบริการเริ่มจากความต้องการ")).toBeVisible();
    fireEvent.click(screen.getByRole("radio", { name: /Promise an installation date/ }));
    fireEvent.click(screen.getByRole("button", { name: "visualLearning.check" }));
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
    fireEvent.click(screen.getByRole("radio", { name: /Clarify the location/ }));
    fireEvent.click(screen.getByRole("button", { name: "visualLearning.check" }));
    fireEvent.click(screen.getByRole("button", { name: "visualLearning.check" }));
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");
    view.unmount();
    const restored = render(<VisualLearning userId="learner-a" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");
    restored.unmount();
    render(<VisualLearning userId="learner-b" />);
    expect(screen.getByRole("button", { name: /visualLearning.begin/ })).toBeVisible();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("loads the external player only after an explicit click and keeps slides navigable", () => {
    render(<VisualLearning userId="video-learner" />);
    fireEvent.click(screen.getByRole("button", { name: "visualLearning.technical" }));
    fireEvent.click(screen.getByRole("button", { name: /visualLearning.begin/ }));
    expect(document.querySelector("iframe")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /visualLearning.loadVideo/ }));
    expect(document.querySelector("iframe")).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/8YreJdKJqh0?rel=0",
    );
    fireEvent.click(screen.getByRole("button", { name: "visualLearning.next" }));
    expect(screen.getByText("A picture is only part of the test.")).toBeVisible();
  });

  it("rejects invalid PoE inputs and distinguishes budget overrun", () => {
    expect(calculatePoeLoad(4, 12, 60)).toEqual({ total: 48, remaining: 12, fits: true });
    expect(calculatePoeLoad(6, 12, 60)?.fits).toBe(false);
    for (const invalid of [0, -1, 1.5, Infinity, NaN])
      expect(calculatePoeLoad(invalid, 12, 60)).toBeNull();
  });
});
