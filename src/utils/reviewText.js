const noiseTerms = [
  "방문자리뷰",
  "블로그리뷰",
  "리뷰",
  "사진",
  "더보기",
  "네이버",
  "영수증",
  "예약",
  "저장",
  "공유",
  "길찾기",
  "전화",
  "홈",
  "메뉴",
  "소식",
  "쿠폰",
];

const noisePatterns = [
  /을왕리\s*동해회조개구이/,
  /방문자리뷰|블로그리뷰|리뷰\s*\d+|사진\s*\d+/,
  /쿠폰|소식|메뉴|지도|주변|팔로우|반응\s*남기기/,
  /더보기|음식이\s*맛있어요|친절해요|뷰가\s*좋아요/,
  /예약\s*없이|대기\s*시간|바로\s*입장|나들이|데이트/,
  /번째\s*방문|영수증|점심에\s*방문|저녁에\s*방문/,
];

const normalizeLine = (line) =>
  line
    .replace(/[^\S\r\n]+/g, " ")
    .replace(/^[^가-힣A-Za-z0-9]+/, "")
    .trim();

const isLikelyReviewLine = (line) => {
  if (line.length <= 1) {
    return false;
  }

  if (noiseTerms.some((term) => line.includes(term))) {
    return false;
  }

  if (noisePatterns.some((pattern) => pattern.test(line))) {
    return false;
  }

  const compact = line.replace(/\s/g, "");
  const hangulCount = (compact.match(/[가-힣]/g) ?? []).length;
  const latinCount = (compact.match(/[A-Za-z]/g) ?? []).length;
  const digitCount = (compact.match(/\d/g) ?? []).length;
  const symbolCount = (compact.match(/[^가-힣A-Za-z0-9.,!?~ㅋㅎㅠㅜ]/g) ?? []).length;

  if (hangulCount < 8) {
    return false;
  }

  if (latinCount > 2 && latinCount > hangulCount * 0.18) {
    return false;
  }

  if (digitCount > hangulCount * 0.4) {
    return false;
  }

  if (symbolCount > hangulCount * 0.3) {
    return false;
  }

  return hangulCount / compact.length >= 0.5;
};

export const normalizeOcrReviewText = (value, maxLength = 900) =>
  String(value ?? "")
    .split(/\r?\n/)
    .map(normalizeLine)
    .filter(isLikelyReviewLine)
    .join("\n")
    .replace(/[.·]{4,}/g, "...")
    .slice(0, maxLength);

export const formatPublicReviewText = (value, maxLength = 180) => {
  const normalizedText = normalizeOcrReviewText(value, maxLength).replace(/\s*\n\s*/g, " ");

  if (normalizedText) {
    return normalizedText;
  }

  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
};
