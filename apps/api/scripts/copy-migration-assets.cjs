const { cpSync, existsSync } = require("node:fs");
const { resolve } = require("node:path");

// Nest's asset copy can omit JSON journals on Windows. Keep the entire
// generated migration payload intact, including metadata and checksums.
const root = resolve(__dirname, "..");
for (const folder of ["migrations", "workflow-migrations"]) {
  const source = resolve(root, "src/storage", folder);
  const destination = resolve(root, "dist/src/storage", folder);
  cpSync(source, destination, { recursive: true });
  if (!existsSync(resolve(destination, "meta/_journal.json"))) {
    throw new Error(`Missing ${folder} journal in compiled application`);
  }
}
