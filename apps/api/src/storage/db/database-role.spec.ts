import { getDatabaseRole } from "./database-role";

describe("database runtime role", () => {
  it("removes only Supabase's pooler routing suffix", () => {
    expect(
      getDatabaseRole(
        "postgres://lms_app_user.nfbbmiqczekeedlsrtce@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres",
      ),
    ).toBe("lms_app_user");
  });

  it("preserves ordinary roles including dots and encoded characters", () => {
    expect(getDatabaseRole("postgres://team.app%2Duser@db.example/postgres")).toBe("team.app-user");
  });

  it("honors a driver user parameter", () => {
    expect(getDatabaseRole("postgres://db.example/postgres?user=lms_app_user")).toBe(
      "lms_app_user",
    );
  });

  it("rejects missing and ambiguous roles without exposing credentials", () => {
    expect(() => getDatabaseRole("postgres://db.example/postgres")).toThrow("runtime role");
    expect(() =>
      getDatabaseRole("postgres://app:secret@aws-0-ap-southeast-1.pooler.supabase.com/postgres"),
    ).toThrow("project reference");
  });
});
