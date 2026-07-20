const targetUrl = process.argv[2] || process.env.SECURITY_HEADER_URL || "";
const results = [];

const pass = (name) => results.push({ status: "PASS", name });
const fail = (name, detail = "") => results.push({ status: "FAIL", name, detail });

if (!/^https?:\/\//i.test(targetUrl)) {
  fail("target URL is provided", "SECURITY_HEADER_URL 또는 첫 번째 인수로 URL을 전달하세요.");
} else {
  const response = await fetch(targetUrl, { redirect: "follow" });
  const headers = response.headers;
  const csp = headers.get("content-security-policy") ?? "";
  const cacheControl = headers.get("cache-control") ?? "";

  response.ok ? pass("target URL is reachable") : fail("target URL is reachable", `status ${response.status}`);
  csp.includes("default-src") ? pass("Content-Security-Policy header is present") : fail("Content-Security-Policy header is present");
  csp.includes("object-src 'none'") ? pass("CSP blocks object embedding") : fail("CSP blocks object embedding");
  (headers.get("x-frame-options") ?? "").toLowerCase() === "deny"
    ? pass("X-Frame-Options DENY is present")
    : fail("X-Frame-Options DENY is present");
  (headers.get("x-content-type-options") ?? "").toLowerCase() === "nosniff"
    ? pass("X-Content-Type-Options nosniff is present")
    : fail("X-Content-Type-Options nosniff is present");
  (headers.get("referrer-policy") ?? "").toLowerCase() === "strict-origin-when-cross-origin"
    ? pass("Referrer-Policy is strict")
    : fail("Referrer-Policy is strict");
  headers.has("permissions-policy") ? pass("Permissions-Policy is present") : fail("Permissions-Policy is present");
  /no-store|no-cache|max-age=0/i.test(cacheControl)
    ? pass("sensitive response cache policy is restrictive")
    : fail("sensitive response cache policy is restrictive", cacheControl || "missing");
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
