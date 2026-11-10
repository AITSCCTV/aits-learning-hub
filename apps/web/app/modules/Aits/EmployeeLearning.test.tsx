import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react";
import { createInstance } from "i18next";
import { Suspense } from "react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { queryClient } from "~/api/queryClient";
import th from "~/locales/th/translation.json";

import { initialLearning, employeeCourses } from "./employee-learning";
import EmployeeLearningPage from "./EmployeeLearning.page";

import type { PropsWithChildren } from "react";

const backend = vi.hoisted(() => ({ settings: {} as Record<string, unknown>, fail: false }));
vi.mock("~/api/api-client", () => ({
  ApiClient: {
    api: {
      settingsControllerGetUserSettings: vi.fn(async () => ({ data: { data: backend.settings } })),
      settingsControllerUpdateUserSettings: vi.fn(async (body: Record<string, unknown>) => {
        if (backend.fail) throw new Error("offline");
        backend.settings = { ...backend.settings, ...body };
        return { data: { data: backend.settings } };
      }),
    },
  },
}));
vi.mock("~/Guards/RequireAuthenticatedUser", () => ({
  RequireAuthenticatedUser: ({ children }: PropsWithChildren) => <>{children}</>,
}));
vi.mock("~/Guards/RouteGuard", () => ({
  RouteGuard: ({ children }: PropsWithChildren) => <>{children}</>,
}));
vi.mock("./EmployeeWelcome.page", () => ({ LearningLanguage: () => null }));
vi.mock("~/api/queryClient", async () => {
  const { QueryClient } = await import("@tanstack/react-query");
  return {
    queryClient: new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    }),
  };
});

afterEach(() => {
  cleanup();
  queryClient.clear();
  backend.fail = false;
});
async function mount() {
  const i18n = createInstance();
  await i18n.init({ lng: "th", resources: { th: { translation: th } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={["/learn"]}>
          <Suspense fallback={null}>
            <EmployeeLearningPage />
          </Suspense>
        </MemoryRouter>
      </I18nextProvider>
    </QueryClientProvider>,
  );
}
describe("Thai first-day journey", () => {
  it("persists company, people, role and correct-answer progress across a remount", async () => {
    backend.settings = { language: "th", employeeLearning: { ...initialLearning } };
    const page = await mount();
    await screen.findByText(th.employeeWelcome.companyTitle);
    fireEvent.click(screen.getByRole("button", { name: th.employeeWelcome.next }));
    await screen.findByText(th.employeeWelcome.peopleTitle);
    expect(screen.getByText(th.employeeWelcome.itContact)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: th.employeeWelcome.next }));
    await screen.findByText(th.employeeWelcome.roleTitle);
    expect(screen.getByRole("button", { name: th.employeeWelcome.startLearning })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: th.employeeWelcome.hr }));
    fireEvent.click(screen.getByRole("button", { name: th.employeeWelcome.startLearning }));
    await screen.findByRole("heading", { name: th.employeeWelcome.learning });
    expect(screen.queryByText("พื้นฐานเอกสารบัญชีและการประสานงาน")).not.toBeInTheDocument();
    const lesson = employeeCourses[0].lessons[0];
    fireEvent.click(screen.getByRole("button", { name: lesson.title.th }));
    await screen.findByRole("heading", { name: lesson.title.th });
    fireEvent.click(screen.getByRole("button", { name: th.employeeWelcome.next }));
    fireEvent.click(screen.getByRole("button", { name: th.employeeWelcome.next }));
    fireEvent.click(screen.getByRole("button", { name: th.employeeWelcome.check }));
    fireEvent.click(
      screen.getByRole("button", {
        name: lesson.options[(lesson.correct + 1) % lesson.options.length].th,
      }),
    );
    expect(screen.getByRole("button", { name: th.employeeWelcome.complete })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: lesson.options[lesson.correct].th }));
    fireEvent.click(screen.getByRole("button", { name: th.employeeWelcome.complete }));
    await waitFor(() =>
      expect(
        (backend.settings.employeeLearning as typeof initialLearning).completedLessons,
      ).toContain(lesson.id),
    );
    page.unmount();
    queryClient.clear();
    await mount();
    await screen.findByRole("heading", { name: th.employeeWelcome.learning });
    expect(
      screen.getByRole("button", { name: employeeCourses[0].lessons[1].title.th }),
    ).toBeEnabled();
    expect(screen.queryByText(th.employeeWelcome.companyTitle)).not.toBeInTheDocument();
  });
  it("does not advance when the server cannot save", async () => {
    backend.settings = { language: "th", employeeLearning: { ...initialLearning } };
    backend.fail = true;
    await mount();
    await screen.findByText(th.employeeWelcome.companyTitle);
    fireEvent.click(screen.getByRole("button", { name: th.employeeWelcome.next }));
    await screen.findByRole("alert");
    expect(screen.getByText(th.employeeWelcome.companyTitle)).toBeInTheDocument();
    expect((backend.settings.employeeLearning as typeof initialLearning).stage).toBe("company");
  });
});
