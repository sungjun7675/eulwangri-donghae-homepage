import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const results = [];

const read = (path) => readFileSync(join(root, path), "utf8");
const pass = (name) => results.push({ status: "PASS", name });
const fail = (name, detail) => results.push({ status: "FAIL", name, detail });

const check = (name, condition, detail = "") => {
  if (condition) {
    pass(name);
  } else {
    fail(name, detail);
  }
};

const walkFiles = (dir, output = []) => {
  for (const entry of readdirSync(join(root, dir), { withFileTypes: true })) {
    const fullPath = join(root, dir, entry.name);
    const relPath = relative(root, fullPath).replaceAll("\\", "/");

    if (["node_modules", "dist", ".git"].some((part) => relPath.includes(part))) {
      continue;
    }

    if (entry.isDirectory()) {
      walkFiles(relPath, output);
    } else {
      output.push(relPath);
    }
  }

  return output;
};

const getTrackedFiles = () =>
  execFileSync("git", ["ls-files"], { cwd: root, encoding: "utf8" })
    .split(/\r?\n/)
    .filter(Boolean);

const getJsonLdHash = (html) => {
  const match = html.match(
    /<script type="application\/ld\+json" id="structured-data">\n(?<body>[\s\S]*?)\n    <\/script>/,
  );

  if (!match?.groups?.body) {
    return "";
  }

  return `sha256-${createHash("sha256").update(match.groups.body, "utf8").digest("base64")}`;
};

const packageJson = JSON.parse(read("package.json"));
const gitignore = read(".gitignore");
const trackedFiles = getTrackedFiles();
const sourceFiles = walkFiles(".").filter((file) =>
  /\.(js|jsx|mjs|html|yml|yaml|sql|json|txt|md|css)$/.test(file),
);
const nonDocFiles = sourceFiles.filter(
  (file) => !file.startsWith("docs/") && file !== "README.md" && file !== "scripts/security-check.mjs",
);

check("package is private", packageJson.private === true);
check("security script is registered", packageJson.scripts?.["security:check"] === "node scripts/security-check.mjs");
check(".env and .env.local are ignored", gitignore.includes(".env") && gitignore.includes(".env.local"));
check(
  "only .env.example is tracked",
  trackedFiles.filter((file) => file.startsWith(".env") && file !== ".env.example").length === 0,
);

const secretPattern =
  /(sb_secret_[A-Za-z0-9_.-]{20,}|BEGIN (RSA |EC |OPENSSH |)PRIVATE KEY|VITE_SUPABASE_SERVICE)/i;
const secretHits = nonDocFiles.filter((file) => secretPattern.test(read(file)));
check("no private/service keys in source or deployment files", secretHits.length === 0, secretHits.join(", "));

const supabaseClient = read("src/lib/supabaseClient.js");
check("Supabase URL format is validated", supabaseClient.includes("isValidSupabaseUrl"));
check("Supabase publishable key format is validated", supabaseClient.includes("isLikelyPublishableKey"));
check("Supabase auth uses sessionStorage", supabaseClient.includes("window.sessionStorage"));
check("Supabase client rejects service_role-like keys", supabaseClient.includes("service_role"));

const admin = read("src/pages/Admin.jsx");
check("admin file upload size limit is present", admin.includes("MAX_REVIEW_UPLOAD_SIZE_BYTES"));
check("admin file MIME allow-list is present", admin.includes("ALLOWED_REVIEW_IMAGE_TYPES"));
check("admin stores private image paths", admin.includes("image_paths"));
check("admin stores image SHA256 hashes", admin.includes("image_hashes"));
check("admin uses signed URLs for review photos", admin.includes("createSignedUrl"));
check("admin records audit logs", admin.includes("recordAuditLog"));
check("admin no longer creates public storage URLs", !admin.includes(".getPublicUrl("));
check("admin form applies local submit throttling", admin.includes("MIN_REVIEW_SUBMIT_INTERVAL_MS"));

const hardeningMigration = "supabase/migrations/20260720223000_harden_admin_reviews_security.sql";
check("security hardening migration exists", existsSync(join(root, hardeningMigration)));

if (existsSync(join(root, hardeningMigration))) {
  const migration = read(hardeningMigration);
  check("review photo bucket is private in latest migration", /public\s*=\s*false/i.test(migration));
  check("storage upload paths are scoped to auth.uid", migration.includes("name like (auth.uid()::text || '/%')"));
  check("audit log table is created", migration.includes("homepage_review_audit_logs"));
  check("review input DB constraints are present", migration.includes("homepage_reviews_text_length_chk"));
}

const indexHtml = read("index.html");
const csp = indexHtml.match(/http-equiv="Content-Security-Policy"\s+content="([^"]+)"/)?.[1] ?? "";
const jsonLdHash = getJsonLdHash(indexHtml);
check("CSP meta is present", Boolean(csp));
check("CSP blocks object embedding", csp.includes("object-src 'none'"));
check("CSP blocks framing via frame-src", csp.includes("frame-src 'none'"));
check("CSP limits connect-src to self and Supabase", csp.includes("connect-src 'self' https://*.supabase.co wss://*.supabase.co"));
check("CSP script-src avoids unsafe-inline", /script-src[^;]+/.test(csp) && !/script-src[^;]+'unsafe-inline'/.test(csp));
check("CSP includes JSON-LD hash", jsonLdHash && csp.includes(jsonLdHash), jsonLdHash);
check("strict referrer policy is present", indexHtml.includes('name="referrer" content="strict-origin-when-cross-origin"'));

const structuredData = read("src/components/common/StructuredData.jsx");
check("React runtime has no dangerouslySetInnerHTML structured data", !structuredData.includes("dangerouslySetInnerHTML"));

const serviceWorker = read("public/sw.js");
check("service worker cache version is hardened", serviceWorker.includes("donghae-homepage-v5"));
check("service worker bypasses cross-origin requests", serviceWorker.includes("requestUrl.origin !== self.location.origin"));
check("service worker does not cache navigation responses", serviceWorker.includes("isNavigationRequest"));
check("service worker caches only successful basic responses", serviceWorker.includes("!response.ok || response.type !== \"basic\""));

const workflow = read(".github/workflows/deploy-pages.yml");
check("GitHub Pages workflow has least-privilege permissions", workflow.includes("contents: read") && workflow.includes("pages: write") && workflow.includes("id-token: write"));
check("GitHub Pages workflow runs security check before build", workflow.includes("npm run security:check"));

const failed = results.filter((result) => result.status === "FAIL");

for (const result of results) {
  const suffix = result.detail ? ` - ${result.detail}` : "";
  console.log(`${result.status}: ${result.name}${suffix}`);
}

if (failed.length > 0) {
  console.error(`Security check failed: ${failed.length} issue(s).`);
  process.exit(1);
}

console.log(`Security check passed: ${results.length} checks.`);
