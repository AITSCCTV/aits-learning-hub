import { existsSync } from "node:fs";
import { extname, resolve } from "node:path";

import express from "express";

import type { Express } from "express";

/** Optional same-origin SPA hosting; API and websocket routes remain owned by Nest. */
export function serveFrontend(app: Express, directory: string) {
  const root = resolve(directory);
  const index = resolve(root, "index.html");
  if (!existsSync(index)) throw new Error("Frontend build is missing index.html");
  const assets = express.static(root, { index: false, dotfiles: "deny" });

  app.use((req, res, next) => {
    const pathname = req.path.toLowerCase();
    const reserved = ["/api", "/socket.io", "/.well-known"].some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
    if (reserved || !["GET", "HEAD"].includes(req.method)) return next();

    assets(req, res, (error) => {
      if (error) return next(error);
      if (extname(pathname) || !req.accepts("html")) return next();
      res.setHeader("Cache-Control", "no-store");
      res.sendFile(index);
    });
  });
}
