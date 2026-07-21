import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const distDir = join(process.cwd(), "dist");
const indexPath = join(distDir, "index.html");
const fallbackSiteUrl = "https://eulwangri-donghae-homepage.vercel.app";
const configuredSiteUrl = String(process.env.VITE_SITE_URL || "").trim().replace(/\/+$/, "");
const siteUrl = configuredSiteUrl || fallbackSiteUrl;

const routeMeta = {
  home: {
    path: "/",
    title: "을왕리 동해회조개구이 | 조개구이·회·해산물",
    description:
      "을왕리해수욕장 인근 동해회조개구이의 메뉴, 위치, 영업 정보, 네이버 플레이스 확인 링크를 한 번에 확인하세요.",
    robots: "index, follow, max-image-preview:large",
  },
  menu: {
    path: "/menu",
    title: "메뉴 | 을왕리 동해회조개구이",
    description:
      "스페셜 세트, 가족 세트, 커플 세트, 조개+치즈가리비 세트 등 을왕리 동해회조개구이 대표 메뉴를 확인하세요.",
    robots: "index, follow, max-image-preview:large",
  },
  store: {
    path: "/store",
    title: "매장소개 | 을왕리 동해회조개구이",
    description:
      "인천 중구 을왕로 62에 위치한 을왕리 동해회조개구이의 매장 정보, 영업시간, 주차·단체 이용 정보를 확인하세요.",
    robots: "index, follow, max-image-preview:large",
  },
  reviews: {
    path: "/reviews",
    title: "리뷰 | 을왕리 동해회조개구이",
    description:
      "을왕리 동해회조개구이의 네이버 플레이스 리뷰 수와 최신 방문자 리뷰 확인 링크를 안내합니다.",
    robots: "index, follow, max-image-preview:large",
  },
  location: {
    path: "/location",
    title: "찾아오시는길 | 을왕리 동해회조개구이",
    description:
      "을왕리 동해회조개구이 주소, 전화번호, 네이버 지도 길찾기 링크와 방문 전 확인 정보를 제공합니다.",
    robots: "index, follow, max-image-preview:large",
  },
  reservation: {
    path: "/reservation",
    title: "이용안내 | 을왕리 동해회조개구이",
    description:
      "을왕리 동해회조개구이 예약 확인, 전화 문의, 영업시간, 주차·단체 이용 전 확인 사항을 정리했습니다.",
    robots: "index, follow, max-image-preview:large",
  },
  admin: {
    path: "/admin",
    title: "리뷰 관리자 | 을왕리 동해회조개구이",
    description: "을왕리 동해회조개구이 운영자 전용 리뷰 관리 화면입니다.",
    robots: "noindex, noarchive",
  },
};

const routes = ["menu", "store", "reviews", "location", "reservation", "admin"];

const escapeAttribute = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const getCanonicalUrl = (path) => `${siteUrl}${path === "/" ? "/" : path}`;

const replaceRequired = (html, pattern, replacement, label) => {
  if (!pattern.test(html)) {
    throw new Error(`Could not find ${label} in dist/index.html`);
  }

  return html.replace(pattern, replacement);
};

const applyRouteMeta = (html, meta) => {
  const title = escapeAttribute(meta.title);
  const description = escapeAttribute(meta.description);
  const canonicalUrl = escapeAttribute(getCanonicalUrl(meta.path));
  const robots = escapeAttribute(meta.robots);

  let nextHtml = html;
  nextHtml = replaceRequired(nextHtml, /<title>[\s\S]*?<\/title>/, `<title>${title}</title>`, "title");
  nextHtml = replaceRequired(
    nextHtml,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/s,
    `<meta name="description" content="${description}" />`,
    "meta description",
  );
  nextHtml = replaceRequired(
    nextHtml,
    /<meta name="robots" content="[^"]*" \/>/,
    `<meta name="robots" content="${robots}" />`,
    "robots meta",
  );
  nextHtml = replaceRequired(
    nextHtml,
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${canonicalUrl}" />`,
    "canonical link",
  );
  nextHtml = replaceRequired(
    nextHtml,
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/s,
    `<meta property="og:title" content="${title}" />`,
    "og title",
  );
  nextHtml = replaceRequired(
    nextHtml,
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/s,
    `<meta property="og:description" content="${description}" />`,
    "og description",
  );
  nextHtml = replaceRequired(
    nextHtml,
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${canonicalUrl}" />`,
    "og url",
  );
  nextHtml = replaceRequired(
    nextHtml,
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/s,
    `<meta name="twitter:title" content="${title}" />`,
    "twitter title",
  );
  nextHtml = replaceRequired(
    nextHtml,
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/s,
    `<meta name="twitter:description" content="${description}" />`,
    "twitter description",
  );
  nextHtml = replaceRequired(
    nextHtml,
    /<meta name="twitter:url" content="[^"]*" \/>/,
    `<meta name="twitter:url" content="${canonicalUrl}" />`,
    "twitter url",
  );

  return nextHtml;
};

if (!existsSync(indexPath)) {
  throw new Error("dist/index.html does not exist. Run vite build first.");
}

const baseHtml = readFileSync(indexPath, "utf8");
writeFileSync(indexPath, applyRouteMeta(baseHtml, routeMeta.home));

for (const route of routes) {
  const routeHtml = applyRouteMeta(baseHtml, routeMeta[route]);
  const htmlPath = join(distDir, `${route}.html`);
  const nestedIndexPath = join(distDir, route, "index.html");

  mkdirSync(dirname(nestedIndexPath), { recursive: true });
  writeFileSync(htmlPath, routeHtml);
  writeFileSync(nestedIndexPath, routeHtml);
}

console.log(`Created route entrypoints: ${routes.join(", ")}`);
