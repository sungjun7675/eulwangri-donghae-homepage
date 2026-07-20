import heroImage from "../assets/images/hero/hero-seafood-cinematic.jpg";
import assortedShellfishImage from "../assets/images/menu/real-assorted-shellfish-optimized.jpg";
import grilledScallopImage from "../assets/images/menu/real-grilled-scallop-optimized.jpg";
import seafoodKalguksuImage from "../assets/images/menu/real-seafood-kalguksu-optimized.jpg";
import shrimpShellfishImage from "../assets/images/menu/real-shrimp-shellfish-optimized.jpg";
import spicyRawFishImage from "../assets/images/menu/real-spicy-raw-fish-optimized.jpg";
import sashimiImage from "../assets/images/review/real-sashimi-optimized.jpg";
import storeImage from "../assets/images/store/real-store-night-optimized.jpg";

export const assets = {
  heroImage,
  sashimiImage,
  storeImage,
};

export const siteInfo = {
  name: "을왕리 동해회조개구이",
  romanName: "ODONGHAE SEAFOOD",
  tagline: "바다의 신선함을 그대로",
  headline: "을왕리 동해\n회조개구이",
  description:
    "신선한 조개와 회를 한 번에 즐기는 최고의 맛. 을왕리의 바다를 담아 정성껏 준비합니다.",
  siteUrl: "https://sungjun7675.github.io/eulwangri-donghae-homepage/",
  address: "인천 중구 을왕로 62",
  phone: "0507-1395-2840",
  businessHours: "일-목 10:00 - 22:00 / 금-토 10:00 - 01:00",
  businessHoursNote: "공개 출처별 영업시간이 일부 달라 방문 전 전화 확인 권장",
  naverPlaceUrl: "https://map.naver.com/p/entry/place/37700467",
  directionsUrl: "https://map.naver.com/p/entry/place/37700467",
  locationHint: "을왕리해수욕장 인근",
  latitude: 37.4492414,
  longitude: 126.37128,
  bookingUrl: "",
  sourceNote: "공개 출처 기반 실제 사진 및 매장 정보 반영",
};

export const navigationItems = [
  { id: "home", label: "홈", href: "#home" },
  { id: "menu", label: "메뉴", href: "#menu" },
  { id: "store", label: "매장소개", href: "#store" },
  { id: "reviews", label: "리뷰", href: "#reviews" },
  { id: "location", label: "찾아오시는길", href: "#location" },
  { id: "reservation", label: "이용안내", href: "#reservation" },
];

export const reviewSummary = {
  provider: "네이버 플레이스",
  status: "확인",
  headline: "최신 정보",
  totalLabel: "리뷰·메뉴·예약은 네이버에서 확인",
  badge: "방문 전 체크",
  rank: "영업시간과 예약 가능 여부는 전화 확인 권장",
};

export const liveReviews = [
  {
    id: 1,
    author: "네이버 플레이스",
    time: "연동 준비",
    label: "REVIEW",
    text: "공식 리뷰 데이터 연결 후 실제 방문자 리뷰가 이 영역에 표시됩니다.",
  },
  {
    id: 2,
    author: "방문자 리뷰",
    time: "확인 필요",
    label: "NAVER",
    text: "현재 문구와 평점은 사용자가 제공한 시안의 레이아웃 확인용 표시입니다.",
  },
  {
    id: 3,
    author: "리뷰 카드",
    time: "시안 상태",
    label: "READY",
    text: "네이버 리뷰 API 또는 운영자가 제공한 실제 리뷰 자료가 들어오면 교체됩니다.",
  },
  {
    id: 4,
    author: "평점 영역",
    time: "검증 대기",
    label: "SCORE",
    text: "평점과 리뷰 수는 네이버 플레이스에서 직접 확인하도록 링크를 연결했습니다.",
  },
  {
    id: 5,
    author: "운영 정보",
    time: "연결 대기",
    label: "PLACE",
    text: "공개 출처로 확인한 매장 정보와 실제 사진은 이미 반영되어 있습니다.",
  },
  {
    id: 6,
    author: "예약 확인",
    time: "확인 권장",
    label: "BOOK",
    text: "예약 가능 여부와 혜택은 방문 전 네이버 플레이스 또는 전화로 확인하세요.",
  },
];

export const featureItems = [
  { label: "신선한 재료", description: "매일 새벽 공수", icon: "fresh" },
  { label: "다양한 메뉴", description: "조개 + 회 + 사이드", icon: "menu" },
  { label: "오션뷰 맛집", description: "탁 트인 바다 전망", icon: "view" },
  { label: "친절한 서비스", description: "정성 가득한 응대", icon: "service" },
  { label: "단체 예약 가능", description: "모임, 회식 환영", icon: "group" },
  { label: "네이버 예약", description: "간편한 예약 시스템", icon: "naver" },
];

export const storeHighlights = [
  {
    label: "을왕리해수욕장 인근",
    description: "해변 방문 전후로 들르기 좋은 위치를 기준으로 안내합니다.",
  },
  {
    label: "조개구이 · 회 · 식사",
    description: "대표 해산물 메뉴와 식사 메뉴를 한 화면에서 확인할 수 있습니다.",
  },
  {
    label: "방문 전 확인 권장",
    description: "영업시간, 예약 가능 여부, 메뉴 구성은 방문 전 전화 확인이 안전합니다.",
  },
];

export const visitChecklist = [
  {
    label: "영업시간",
    description: "공개 출처별 시간이 일부 달라 방문 전 전화 확인을 권장합니다.",
  },
  {
    label: "예약",
    description: "네이버 플레이스에서 예약 가능 여부를 먼저 확인하세요.",
  },
  {
    label: "단체 방문",
    description: "모임, 회식 등 인원수가 있는 방문은 전화 문의가 가장 정확합니다.",
  },
  {
    label: "메뉴 구성",
    description: "당일 재료 상황에 따라 구성과 판매 여부가 달라질 수 있습니다.",
  },
];

export const menuItems = [
  {
    name: "모듬조개구이",
    category: "대표 구이",
    description: "여러 조개를 한 번에 즐길 수 있는 대표 메뉴입니다.",
    note: "구성 및 가격은 방문 전 확인 권장",
    image: assortedShellfishImage,
    alt: "동해회조개구이의 조개 모둠 사진",
    imagePosition: "center",
  },
  {
    name: "가리비구이",
    category: "조개구이",
    description: "불향과 조개 특유의 고소함을 즐기기 좋은 메뉴입니다.",
    note: "당일 재료 상황에 따라 구성 변동 가능",
    image: grilledScallopImage,
    alt: "불판 위 가리비구이 사진",
    imagePosition: "center",
  },
  {
    name: "새우구이",
    category: "구이 메뉴",
    description: "구운 새우의 담백한 풍미를 조개구이와 함께 즐길 수 있습니다.",
    note: "정확한 제공 구성은 매장 확인",
    image: shrimpShellfishImage,
    alt: "새우와 조개가 담긴 해산물 모둠 사진",
    imagePosition: "center 44%",
  },
  {
    name: "해물칼국수",
    category: "식사 메뉴",
    description: "해산물과 따뜻한 국물이 어울리는 식사 메뉴입니다.",
    note: "영업일 기준 판매 여부 확인 권장",
    image: seafoodKalguksuImage,
    alt: "해물칼국수 사진",
    imagePosition: "center",
  },
  {
    name: "회무침",
    category: "회 메뉴",
    description: "매콤새콤한 양념과 채소를 곁들여 즐기는 메뉴입니다.",
    note: "계절과 재료 상황에 따라 변동 가능",
    image: spicyRawFishImage,
    alt: "채소와 회가 담긴 회무침 사진",
    imagePosition: "center",
  },
];

export const galleryItems = [
  {
    name: "조개구이 한상",
    image: heroImage,
    alt: "불판 위 조개구이 한상 사진",
    imagePosition: "center",
  },
  {
    name: "회 한 접시",
    image: sashimiImage,
    alt: "접시에 담긴 회 사진",
    imagePosition: "center",
  },
  {
    name: "치즈 가리비",
    image: grilledScallopImage,
    alt: "불판 위 치즈 가리비 사진",
    imagePosition: "center",
  },
  {
    name: "해물칼국수",
    image: seafoodKalguksuImage,
    alt: "해물칼국수 사진",
    imagePosition: "center",
  },
];

export const photoSources = [
  {
    label: "당근 동해회조개구이 지역 프로필",
    url: "https://www.daangn.com/kr/local-profile/%EB%8F%99%ED%95%B4%ED%9A%8C%EC%A1%B0%EA%B0%9C%EA%B5%AC%EC%9D%B4-1bxxdvjaq75d/",
  },
  {
    label: "NateView 동해회조개구이 방문 사진",
    url: "https://view.nate.com/travel/view/249971/",
  },
  {
    label: "DiningCode 동해회조개구이 사진",
    url: "https://www.diningcode.com/profile.php?rid=Gu1D5TxUAJmJ",
  },
];

export const businessInfoSources = [
  {
    label: "동해회조개구이 인스타그램 프로필",
    url: "https://www.instagram.com/donghae_jogae92/",
  },
  {
    label: "DiningCode 동해회조개구이 매장 정보",
    url: "https://www.diningcode.com/profile.php?rid=Gu1D5TxUAJmJ",
  },
  {
    label: "Siksin 동해회조개구이 매장 정보",
    url: "https://www.siksinhot.com/P/457332",
  },
  {
    label: "네이버 플레이스 동해회조개구이",
    url: "https://map.naver.com/p/entry/place/37700467",
  },
];
