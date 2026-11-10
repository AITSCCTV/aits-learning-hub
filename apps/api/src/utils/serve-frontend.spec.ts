import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import express from "express";
import request from "supertest";

import { serveFrontend } from "./serve-frontend";

describe("same-origin frontend hosting", () => {
  const directory = mkdtempSync(join(tmpdir(), "aits-frontend-test-"));
  beforeAll(() => {
    writeFileSync(join(directory, "index.html"), "<!doctype html><title>AITS</title>");
    writeFileSync(join(directory, "app.js"), "window.loaded=true;");
  });
  afterAll(() => rmSync(directory, { recursive: true, force: true }));

  function app() {
    const server = express();
    serveFrontend(server, directory);
    server.get("/api/health", (_req, res) => res.json({ healthy: true }));
    return server;
  }

  it("serves frontend navigation and assets", async () => {
    await request(app())
      .get("/courses/123")
      .set("Accept", "text/html")
      .expect(200)
      .expect("Cache-Control", "no-store")
      .expect(/<title>AITS/);
    await request(app())
      .get("/app.js")
      .expect(200)
      .expect(/window.loaded/);
  });

  it("preserves API routes and does not turn missing backend endpoints into HTML", async () => {
    await request(app()).get("/api/health").expect(200, { healthy: true });
    for (const path of [
      "/api/missing",
      "/API/missing",
      "/socket.io/missing",
      "/.well-known/missing",
      "/missing.js",
    ]) {
      await request(app()).get(path).set("Accept", "text/html").expect(404);
    }
    await request(app()).post("/login").expect(404);
    await request(app()).get("/unknown").set("Accept", "application/json").expect(404);
  });

  it("fails startup when the configured frontend is absent", () => {
    expect(() => serveFrontend(express(), join(directory, "missing"))).toThrow(
      "missing index.html",
    );
  });
});
