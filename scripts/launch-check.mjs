import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const results = [];
const siteUrl = "https://eulwangri-donghae-homepage.vercel.app";
const publicRoutes = ["/", "/menu", "/store", "/reviews", "/location", "/reservation"];
const adminHeaderSources = ["/admin", "/admin/", "/admin/:path*"];

const read = (path) => readFileSync(join(root, path), "utf8");
const readJson = (path) => JSON.parse(read(path));
const pass = (name) => results.push({ status: "PASS", name });
const fail = (name, detail = "") => results.push({ status: "FAIL", name, detail });
const check = (name, condition, detail = "") => (condition ? pass(name) : fail(name, detail));

const fileExists = (path) => existsSync(join(root, path));
const hasText = (path, text) => fileExists(path) && read(path).includes(text);

const packageJson = readJson("package.json");
const manifest = readJson("public/manifest.webmanifest");
const vercelConfig = readJson("vercel.json");
const sitemap = read("public/sitemap.xml");
const robots = read("public/robots.txt");
const routeEntrypoints = read("scripts/create-route-entrypoints.mjs");
const reviewSection = read("src/components/sections/ReviewGuideSection.jsx");
const siteData = read("src/data/siteData.js");

const getHeaderValue = (source, key) =>
  vercelConfig.headers
    ?.find((entry) => entry.source === source)
    ?.headers?.find((header) => header.key.toLowerCase() === key.toLowerCase())?.value ?? "";

check("launch check script is registered", packageJson.scripts?.["launch:check"] === "node scripts/launch-check.mjs");
check("production output directory is dist", vercelConfig.outputDirectory === "dist");
check("Vercel build uses project build script", vercelConfig.buildCommand === "npm run build");
check("PWA manifest start_url uses deployed root", manifest.start_url === "/");
check("PWA manifest scope uses deployed root", manifest.scope === "/");
check("robots.txt points to production sitemap", robots.includes(`${siteUrl}/sitemap.xml`));
check("robots.txt blocks admin route", /Disallow:\s*\/admin\b/i.test(robots));
check("sitemap excludes admin route", !sitemap.includes(`${siteUrl}/admin`));

for (const route of publicRoutes) {
  const loc = `${siteUrl}${route === "/" ? "/" : route}`;
  check(`sitemap includes ${route}`, sitemap.includes(`<loc>${loc}</loc>`));
}

for (const route of ["menu", "store", "reviews", "location", "reservation", "admin"]) {
  check(`route metadata exists for ${route}`, routeEntrypoints.includes(`${route}: {`));
}

check("route entrypoints write route-specific metadata", routeEntrypoints.includes("applyRouteMeta"));
check("route entrypoints set canonical URL per route", routeEntrypoints.includes("getCanonicalUrl"));
check("admin route entrypoint is noindex", routeEntrypoints.includes('robots: "noindex, noarchive"'));
check("public review rendering requires commercial approval", reviewSection.includes("isCommercialUseApproved === true"));
check("commercial review policy is present", siteData.includes("commercialReviewPolicy"));
check("public review client data is empty until rights approval", /export const publicReviewItems = \[\];/.test(siteData));
check("public review client data has no copied reviewer handles", !/하늘\*\*48|디고\*\*니7|lks\*\*\*\*|오와\*\*id/.test(siteData));
check("public review fallback does not render review photos", reviewSection.includes("public-review-safe-grid"));

for (const source of adminHeaderSources) {
  const cache = getHeaderValue(source, "Cache-Control");
  const robotsTag = getHeaderValue(source, "X-Robots-Tag");

  check(`${source} cache is no-store`, /no-store/i.test(cache), cache || "missing");
  check(`${source} has X-Robots-Tag noindex`, /noindex/i.test(robotsTag), robotsTag || "missing");
  check(`${source} has X-Robots-Tag noarchive`, /noarchive/i.test(robotsTag), robotsTag || "missing");
}

check("hashed Vite assets use immutable cache", getHeaderValue("/assets/:path*", "Cache-Control").includes("immutable"));
check("commercial launch checklist exists", fileExists("docs/commercial-launch-checklist.md"));
check("launch checklist covers domain connection", hasText("docs/commercial-launch-checklist.md", "도메인"));
check("launch checklist covers review rights", hasText("docs/commercial-launch-checklist.md", "리뷰"));
check("launch checklist covers privacy policy", hasText("docs/commercial-launch-checklist.md", "개인정보"));
check("unused public og.png is absent", !fileExists("public/og.png"));
check("unused public og.jpg is absent", !fileExists("public/og.jpg"));
check("unused public og-hero-cinematic.png is absent", !fileExists("public/og-hero-cinematic.png"));
check("active OG image remains available", fileExists("public/og-hero-cinematic.jpg"));

for (const result of results) {
  const suffix = result.detail ? ` - ${result.detail}` : "";
  console.log(`${result.status}: ${result.name}${suffix}`);
}

const failed = results.filter((result) => result.status === "FAIL");

if (failed.length > 0) {
  console.error(`Launch check failed: ${failed.length} issue(s).`);
  process.exit(1);
}

console.log(`Launch check passed: ${results.length} checks.`);
