const targetUrl = process.argv[2] || process.env.SECURITY_HEADER_URL || "";
const explicitAdminUrl = process.argv[3] || process.env.SECURITY_HEADER_ADMIN_URL || "";
const results = [];

const pass = (name) => results.push({ status: "PASS", name });
const fail = (name, detail = "") => results.push({ status: "FAIL", name, detail });

const getAdminUrl = (baseUrl) => {
  if (/^https?:\/\//i.test(explicitAdminUrl)) {
    return explicitAdminUrl;
  }

  const url = new URL(baseUrl);
  url.pathname = `${url.pathname.replace(/\/+$/, "")}/admin`.replace("//admin", "/admin");
  url.search = "";
  url.hash = "";
  return url.href;
};

const getAdminSlashUrl = (adminUrl) => {
  const url = new URL(adminUrl);
  url.pathname = `${url.pathname.replace(/\/+$/, "")}/`;
  url.search = "";
  url.hash = "";
  return url.href;
};

const checkCommonHeaders = (label, headers) => {
  const csp = headers.get("content-security-policy") ?? "";

  csp.includes("default-src")
    ? pass(`${label} Content-Security-Policy header is present`)
    : fail(`${label} Content-Security-Policy header is present`);
  csp.includes("object-src 'none'")
    ? pass(`${label} CSP blocks object embedding`)
    : fail(`${label} CSP blocks object embedding`);
  csp.includes("frame-ancestors 'none'")
    ? pass(`${label} CSP blocks frame ancestors`)
    : fail(`${label} CSP blocks frame ancestors`);
  !/style-src[^;]+'unsafe-inline'/.test(csp)
    ? pass(`${label} CSP blocks inline styles`)
    : fail(`${label} CSP blocks inline styles`);
  (headers.get("strict-transport-security") ?? "").toLowerCase().includes("includesubdomains")
    ? pass(`${label} HSTS includeSubDomains is present`)
    : fail(`${label} HSTS includeSubDomains is present`);
  (headers.get("x-frame-options") ?? "").toLowerCase() === "deny"
    ? pass(`${label} X-Frame-Options DENY is present`)
    : fail(`${label} X-Frame-Options DENY is present`);
  (headers.get("x-content-type-options") ?? "").toLowerCase() === "nosniff"
    ? pass(`${label} X-Content-Type-Options nosniff is present`)
    : fail(`${label} X-Content-Type-Options nosniff is present`);
  (headers.get("referrer-policy") ?? "").toLowerCase() === "strict-origin-when-cross-origin"
    ? pass(`${label} Referrer-Policy is strict`)
    : fail(`${label} Referrer-Policy is strict`);
  headers.has("permissions-policy")
    ? pass(`${label} Permissions-Policy is present`)
    : fail(`${label} Permissions-Policy is present`);
};

if (!/^https?:\/\//i.test(targetUrl)) {
  fail("target URL is provided", "SECURITY_HEADER_URL 또는 첫 번째 인수로 URL을 전달하세요.");
} else {
  const response = await fetch(targetUrl, { redirect: "follow" });

  response.ok ? pass("target URL is reachable") : fail("target URL is reachable", `status ${response.status}`);
  checkCommonHeaders("public", response.headers);

  const publicCacheControl = response.headers.get("cache-control") ?? "";
  /no-store|no-cache|max-age=0|must-revalidate/i.test(publicCacheControl)
    ? pass("public HTML cache policy is revalidation-based")
    : fail("public HTML cache policy is revalidation-based", publicCacheControl || "missing");

  const adminUrl = getAdminUrl(targetUrl);
  const adminResponse = await fetch(adminUrl, { redirect: "follow" });
  const adminCacheControl = adminResponse.headers.get("cache-control") ?? "";

  adminResponse.ok
    ? pass("admin URL is reachable")
    : fail("admin URL is reachable", `status ${adminResponse.status}`);
  checkCommonHeaders("admin", adminResponse.headers);
  /no-store/i.test(adminCacheControl)
    ? pass("admin response cache policy is no-store")
    : fail("admin response cache policy is no-store", adminCacheControl || "missing");

  const adminSlashResponse = await fetch(getAdminSlashUrl(adminUrl), { redirect: "follow" });
  const adminSlashCacheControl = adminSlashResponse.headers.get("cache-control") ?? "";

  adminSlashResponse.ok
    ? pass("admin trailing-slash URL is reachable")
    : fail("admin trailing-slash URL is reachable", `status ${adminSlashResponse.status}`);
  /no-store/i.test(adminSlashCacheControl)
    ? pass("admin trailing-slash cache policy is no-store")
    : fail("admin trailing-slash cache policy is no-store", adminSlashCacheControl || "missing");
}

for (const result of results) {
  const suffix = result.detail ? ` - ${result.detail}` : "";
  console.log(`${result.status}: ${result.name}${suffix}`);
}

const failed = results.filter((result) => result.status === "FAIL");

if (failed.length > 0) {
  console.error(`Header check failed: ${failed.length} issue(s).`);
  process.exitCode = 1;
} else {
  console.log(`Header check passed: ${results.length} checks.`);
}
