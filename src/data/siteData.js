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
  address: "인천 영종구 을왕로 62",
  phone: "0507-1395-2840",
  businessHours: "네이버 플레이스에서 당일 영업 상태 확인",
  businessHoursNote: "영업시간과 휴무일은 변동될 수 있어 방문 전 네이버 플레이스 또는 전화 확인 권장",
  naverPlaceUrl: "https://map.naver.com/p/entry/place/37700467",
  directionsUrl: "https://map.naver.com/p/entry/place/37700467",
  locationHint: "을왕리해수욕장 인근",
  latitude: 37.4492414,
  longitude: 126.37128,
  bookingUrl: "",
  sourceNote: "네이버 검색 결과와 공개 출처 기반 매장 정보 반영",
  verifiedDate: "2026.07.20",
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
  status: "2026.07.20 확인",
  headline: "리뷰 3,351",
  totalLabel: "네이버 검색 결과 기준",
  badge: "평점·예약·영업",
  rank: "최신 상태는 네이버 플레이스에서 확인",
};

export const featureItems = [
  { label: "신선한 재료", description: "매일 새벽 공수", icon: "fresh" },
  { label: "다양한 메뉴", description: "조개 + 회 + 사이드", icon: "menu" },
  { label: "오션뷰 맛집", description: "탁 트인 바다 전망", icon: "view" },
  { label: "친절한 서비스", description: "정성 가득한 응대", icon: "service" },
  { label: "단체 예약 가능", description: "모임, 회식 환영", icon: "group" },
  { label: "네이버 예약", description: "간편한 예약 시스템", icon: "naver" },
];

export const localSeoItems = [
  {
    label: "을왕리 조개구이",
    title: "해수욕장 인근 해산물 방문 코스",
    description:
      "을왕리해수욕장 인근에서 조개구이, 회, 해산물 세트를 한 번에 확인할 수 있도록 구성했습니다.",
  },
  {
    label: "영종구 해산물",
    title: "인천 영종구 을왕로 62",
    description:
      "네이버 검색 결과 기준 주소와 전화번호, 길찾기 링크를 연결해 방문 전 확인이 빠릅니다.",
  },
  {
    label: "오션뷰·단체",
    title: "오션뷰와 단체 이용 편의",
    description:
      "네이버 검색 결과 기준 단체 이용, 예약, 주차, 발렛파킹, 무선 인터넷 편의 정보를 반영했습니다.",
  },
  {
    label: "네이버 리뷰",
    title: "리뷰 3,351건 기준 안내",
    description:
      "방문자 리뷰와 실제 방문 사진은 네이버 플레이스에서 최신 상태로 확인할 수 있게 연결했습니다.",
  },
];

export const storeHighlights = [
  {
    label: "을왕리해수욕장 인근",
    description: "해변 방문 전후로 들르기 좋은 위치를 기준으로 안내합니다.",
  },
  {
    label: "조개구이 · 회 · 세트",
    description: "네이버 메뉴 기준 스페셜, 가족, 커플, 치즈가리비 세트 구성이 있습니다.",
  },
  {
    label: "주차 · 발렛파킹",
    description: "네이버 검색 결과 기준 주차와 발렛파킹 편의 정보를 확인했습니다.",
  },
  {
    label: "단체 · 예약 가능",
    description: "단체 이용, 예약, 포장, 무선 인터넷, 유아의자 정보를 네이버 기준으로 반영했습니다.",
  },
];

export const visitChecklist = [
  {
    label: "영업시간",
    description: "네이버 플레이스에서 당일 영업 상태와 휴무일을 확인하세요.",
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
    description: "스페셜, 가족, 커플, 치즈가리비 세트 가격대는 네이버 메뉴 기준으로 확인하세요.",
  },
];

export const menuItems = [
  {
    name: "스페셜Set",
    category: "대표 세트",
    description: "회와 조개구이, 해산물 구성을 함께 즐기기 좋은 대표 세트입니다.",
    note: "소/중/대/특대 160,000~250,000원",
    image: assortedShellfishImage,
    alt: "동해회조개구이의 조개 모둠 사진",
    imagePosition: "center",
  },
  {
    name: "가족 Set",
    category: "세트 메뉴",
    description: "여러 명이 함께 먹기 좋은 해산물 중심의 가족 방문용 세트입니다.",
    note: "소/중/대/특대 140,000~230,000원",
    image: sashimiImage,
    alt: "접시에 담긴 회 사진",
    imagePosition: "center",
  },
  {
    name: "커플 Set",
    category: "세트 메뉴",
    description: "을왕리 해변 방문 전후로 둘이 즐기기 좋은 세트 구성입니다.",
    note: "소/중/대/특대 100,000~170,000원",
    image: shrimpShellfishImage,
    alt: "새우와 조개가 담긴 해산물 모둠 사진",
    imagePosition: "center 44%",
  },
  {
    name: "조개+치즈가리비 Set",
    category: "조개구이",
    description: "조개구이와 치즈가리비를 함께 즐길 수 있는 네이버 노출 메뉴입니다.",
    note: "소/중/대 100,000~140,000원",
    image: grilledScallopImage,
    alt: "불판 위 가리비구이 사진",
    imagePosition: "center",
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
    caption: "불판 위에서 즐기는 을왕리 조개구이 대표 이미지",
    image: heroImage,
    alt: "불판 위 조개구이 한상 사진",
    imagePosition: "center",
  },
  {
    name: "회 한 접시",
    caption: "회와 해산물 세트 구성을 함께 확인할 수 있는 메뉴 사진",
    image: sashimiImage,
    alt: "접시에 담긴 회 사진",
    imagePosition: "center",
  },
  {
    name: "치즈 가리비",
    caption: "네이버 메뉴에 노출된 조개+치즈가리비 세트와 어울리는 메뉴 사진",
    image: grilledScallopImage,
    alt: "불판 위 치즈 가리비 사진",
    imagePosition: "center",
  },
  {
    name: "해물칼국수",
    caption: "해산물 식사 메뉴를 찾는 방문자를 위한 식사 사진",
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
    label: "네이버 검색 결과 동해회조개구이",
    url: "https://search.naver.com/search.naver?where=nexearch&query=%EC%9D%84%EC%99%95%EB%A6%AC%20%EB%8F%99%ED%95%B4%ED%9A%8C%EC%A1%B0%EA%B0%9C%EA%B5%AC%EC%9D%B4",
  },
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
