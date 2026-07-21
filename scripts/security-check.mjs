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
check(
  "Supabase live security script is registered",
  packageJson.scripts?.["security:supabase"] === "node scripts/supabase-security-check.mjs",
);
check(
  "HTTP header security script is registered",
  packageJson.scripts?.["security:headers"] === "node scripts/header-check.mjs",
);
check(".env and .env.local are ignored", gitignore.includes(".env") && gitignore.includes(".env.local"));
check(
  "only .env.example is tracked",
  trackedFiles.filter((file) => file.startsWith(".env") && file !== ".env.example").length === 0,
);
check("admin edge function flag is documented", read(".env.example").includes("VITE_USE_ADMIN_EDGE_FUNCTIONS=false"));

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
const adminReviewApi = read("src/lib/adminReviewApi.js");
check("admin edge function client is isolated", adminReviewApi.includes("invokeAdminReviewAction"));
check("admin edge function mode is feature-flagged", adminReviewApi.includes("VITE_USE_ADMIN_EDGE_FUNCTIONS"));
check("admin mutations can use edge function boundary", admin.includes("invokeAdminReviewAction"));
check("admin file upload size limit is present", admin.includes("MAX_REVIEW_UPLOAD_SIZE_BYTES"));
check("admin file MIME allow-list is present", admin.includes("ALLOWED_REVIEW_IMAGE_TYPES"));
check("admin stores private image paths", admin.includes("image_paths"));
check("admin stores image SHA256 hashes", admin.includes("image_hashes"));
check("admin uses signed URLs for review photos", admin.includes("createSignedUrl"));
check("admin records audit logs", admin.includes("recordAuditLog"));
check("admin no longer creates public storage URLs", !admin.includes(".getPublicUrl("));
check("admin form applies local submit throttling", admin.includes("MIN_REVIEW_SUBMIT_INTERVAL_MS"));

const hardeningMigration = "supabase/migrations/20260720223000_harden_admin_reviews_security.sql";
const finalBoundaryMigration = "supabase/migrations/20260720230000_harden_admin_boundary_and_rate_limit.sql";
const ensureAdminMigration = "supabase/migrations/20260721120500_ensure_homepage_admin.sql";
check("security hardening migration exists", existsSync(join(root, hardeningMigration)));

if (existsSync(join(root, hardeningMigration))) {
  const migration = read(hardeningMigration);
  check("review photo bucket is private in latest migration", /public\s*=\s*false/i.test(migration));
  check("storage upload paths are scoped to auth.uid", migration.includes("name like (auth.uid()::text || '/%')"));
  check("audit log table is created", migration.includes("homepage_review_audit_logs"));
  check("review input DB constraints are present", migration.includes("homepage_reviews_text_length_chk"));
}

check("admin boundary and rate limit migration exists", existsSync(join(root, finalBoundaryMigration)));
check("homepage admin entitlement migration exists", existsSync(join(root, ensureAdminMigration)));

if (existsSync(join(root, finalBoundaryMigration))) {
  const migration = read(finalBoundaryMigration);
  check("inactive admins are blocked in DB function", migration.includes("is_active is true"));
  check("public review table policy is removed", migration.includes('drop policy if exists "Published homepage reviews are readable"'));
  check("rate limit table is created", migration.includes("homepage_security_rate_limits"));
  check("service-role-only rate limit RPC is created", migration.includes("homepage_take_rate_limit") && migration.includes("to service_role"));
}

const edgeFunctionPath = "supabase/functions/admin-review/index.ts";
check("admin edge function exists", existsSync(join(root, edgeFunctionPath)));

if (existsSync(join(root, edgeFunctionPath))) {
  const edgeFunction = read(edgeFunctionPath);
  check("edge function keeps service role server-side", edgeFunction.includes("SUPABASE_SERVICE_ROLE_KEY"));
  check("edge function verifies JWT user", edgeFunction.includes("auth.getUser()"));
  check("edge function checks active admin", edgeFunction.includes(".eq(\"is_active\", true)"));
  check("edge function applies server rate limit", edgeFunction.includes("homepage_take_rate_limit"));
  check("edge function applies origin allow-list", edgeFunction.includes("ALLOWED_ADMIN_ORIGINS"));
  check("edge function does not use wildcard CORS", !edgeFunction.includes('"Access-Control-Allow-Origin": "*"'));
  check("edge function avoids response caching", edgeFunction.includes('"Cache-Control": "no-store"'));
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
check("GitHub Pages workflow runs Supabase boundary check", workflow.includes("npm run security:supabase"));
check("GitHub Pages workflow passes edge-function feature flag", workflow.includes("VITE_USE_ADMIN_EDGE_FUNCTIONS"));

const scheduledAudit = read(".github/workflows/security-audit.yml");
check("scheduled security audit workflow exists", scheduledAudit.includes("Scheduled security audit"));
check("scheduled security audit runs dependency audit", scheduledAudit.includes("npm audit --audit-level=moderate"));
check("scheduled security audit runs production build", scheduledAudit.includes("npm run build"));

const supabaseDeployWorkflow = read(".github/workflows/deploy-supabase-security.yml");
check("manual Supabase security deploy workflow exists", supabaseDeployWorkflow.includes("Deploy Supabase security boundary"));
check("Supabase deploy workflow applies migrations", supabaseDeployWorkflow.includes("20260720230000_harden_admin_boundary_and_rate_limit.sql"));
check("Supabase deploy workflow ensures active homepage admin", supabaseDeployWorkflow.includes("20260721120500_ensure_homepage_admin.sql"));
check("Supabase deploy workflow allows local admin verification origins", supabaseDeployWorkflow.includes("http://127.0.0.1:4175"));
check("Supabase deploy workflow deploys admin edge function", supabaseDeployWorkflow.includes("functions deploy admin-review"));
check("Supabase deploy workflow requires access token", supabaseDeployWorkflow.includes("SUPABASE_ACCESS_TOKEN"));
check("Supabase deploy workflow requires DB URL", supabaseDeployWorkflow.includes("SUPABASE_DB_URL"));

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
