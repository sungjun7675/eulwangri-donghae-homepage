import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const distDir = join(process.cwd(), "dist");
const indexPath = join(distDir, "index.html");
const routes = ["menu", "store", "reviews", "location", "reservation", "admin"];

if (!existsSync(indexPath)) {
  throw new Error("dist/index.html does not exist. Run vite build first.");
}

for (const route of routes) {
  const htmlPath = join(distDir, `${route}.html`);
  const nestedIndexPath = join(distDir, route, "index.html");

  mkdirSync(dirname(nestedIndexPath), { recursive: true });
  copyFileSync(indexPath, htmlPath);
  copyFileSync(indexPath, nestedIndexPath);
}

console.log(`Created route entrypoints: ${routes.join(", ")}`);
