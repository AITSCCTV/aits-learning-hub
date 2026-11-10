/** Supavisor appends the project reference to the login, not the Postgres role. */
export function getDatabaseRole(connectionUrl: string): string {
  const url = new URL(connectionUrl);
  const login = url.searchParams.get("user") || decodeURIComponent(url.username);

  if (!login) throw new Error("Application database URL must specify its runtime role");

  if (url.hostname.endsWith(".pooler.supabase.com")) {
    const match = /^(.*)\.[a-z]{20}$/.exec(login);
    if (!match?.[1]) throw new Error("Supabase pooler login must include its project reference");
    return match[1];
  }

  return login;
}
