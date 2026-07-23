import heroImage from "../assets/images/hero/hero-seafood-cinematic.jpg";
import assortedShellfishImage from "../assets/images/menu/real-assorted-shellfish-optimized.jpg";
import officialCheeseScallopImage from "../assets/images/menu/real-cheese-scallop-official.jpg";
import seafoodKalguksuImage from "../assets/images/menu/real-seafood-kalguksu-optimized.jpg";
import shrimpShellfishImage from "../assets/images/menu/real-shrimp-shellfish-optimized.jpg";
import spicyRawFishImage from "../assets/images/menu/real-spicy-raw-fish-optimized.jpg";
import sashimiImage from "../assets/images/review/real-sashimi-optimized.jpg";
import storeImage from "../assets/images/store/real-store-night-optimized.jpg";

const configuredSiteUrl = String(import.meta.env.VITE_SITE_URL || "").trim();
const productionSiteUrl = configuredSiteUrl || "https://eulwangri-donghae-homepage.vercel.app/";

export const assets = {
  heroImage,
  sashimiImage,
  storeImage,
};

export const siteInfo = {
  name: "을왕리 동해회조개구이",
  romanName: "DONGHAE SEAFOOD",
  tagline: "바다의 신선함을 그대로",
  headline: "을왕리 동해\n회조개구이",
  description:
    "조개구이와 회, 해산물을 한 번에 즐기는 을왕리 해변 인근 식당입니다. 방문 전 메뉴와 예약 가능 여부를 바로 확인할 수 있게 정리했습니다.",
  siteUrl: productionSiteUrl,
  address: "인천 중구 을왕로 62",
  phone: "0507-1395-2840",
  businessHours: "평일 10:00~24:00 / 금·토 10:00~02:00",
  businessHoursNote: "공개 검색 결과 기준이며 휴무, 라스트오더, 재료 소진은 방문 전 전화 또는 네이버 플레이스 확인 권장",
  naverPlaceUrl: "https://map.naver.com/p/entry/place/37700467",
  directionsUrl: "https://map.naver.com/p/entry/place/37700467",
  bookingUrl: "",
  locationHint: "을왕리해수욕장 인근",
  latitude: 37.4492414,
  longitude: 126.37128,
  sourceNote: "네이버 플레이스와 공개 검색 결과 기준 정보 반영",
  verifiedDate: "2026.07.23",
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
  status: "2026.07.21 확인",
  headline: "리뷰 3,351",
  totalLabel: "공개 검색 결과 기준",
  badge: "평점·예약·영업",
  rank: "최신 상태는 네이버 플레이스에서 확인",
};

export const commercialReviewPolicy = {
  heading: "네이버 원문은 링크로 연결하고 확인된 자료만 노출합니다",
  description:
    "방문자 리뷰 원문과 사진은 최신 상태를 네이버 플레이스에서 바로 확인할 수 있게 연결합니다. 홈페이지에는 리뷰 수, 방문 전 확인 포인트, 사용 허락이 확인된 사진만 반영합니다.",
  items: [
    {
      label: "리뷰 확인",
      value: "리뷰 수와 최신 후기는 네이버 플레이스로 연결",
    },
    {
      label: "사진 사용",
      value: "업체 등록 사진과 사용 허락이 확인된 사진만 노출",
    },
    {
      label: "방문 판단",
      value: "영업시간, 예약, 주차, 메뉴는 방문 전 재확인 권장",
    },
  ],
};

export const primaryActions = [
  {
    label: "전화 문의",
    helper: "영업·대기·단체 확인",
    href: `tel:${siteInfo.phone.replaceAll("-", "")}`,
    icon: "☎",
    tone: "outline",
  },
  {
    label: siteInfo.bookingUrl ? "네이버 예약" : "네이버 확인",
    helper: siteInfo.bookingUrl ? "예약 가능 여부 확인" : "예약·리뷰·영업 확인",
    href: siteInfo.bookingUrl || siteInfo.naverPlaceUrl,
    icon: "N",
    tone: "solid",
    external: true,
  },
  {
    label: "길찾기",
    helper: "네이버 지도 바로가기",
    href: siteInfo.directionsUrl,
    icon: "⌖",
    tone: "outline",
    external: true,
  },
];

export const heroFacts = [
  { label: "대표 세트", value: "100,000원대부터", helper: "커플·가족·스페셜 구성" },
  { label: "위치", value: "을왕리해수욕장 인근", helper: "해변 방문 전후 동선" },
  { label: "편의", value: "주차·단체·예약", helper: "방문 전 네이버/전화 확인" },
];

export const featureItems = [
  { label: "신선한 재료", description: "조개구이와 회 구성", icon: "fresh" },
  { label: "다양한 메뉴", description: "조개 + 회 + 식사", icon: "menu" },
  { label: "해변 인근", description: "을왕리 방문 동선", icon: "view" },
  { label: "친절한 응대", description: "방문 리뷰 언급", icon: "service" },
  { label: "단체 이용", description: "모임·회식 확인", icon: "group" },
  { label: "예약 확인", description: "네이버·전화 연결", icon: "naver" },
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
    title: "인천 중구 을왕로 62",
    description: "주소, 전화번호, 길찾기 링크를 한 화면에 연결해 방문 전 확인이 빠릅니다.",
  },
  {
    label: "주차·단체",
    title: "방문 전 확인이 쉬운 이용 정보",
    description: "주차, 발렛파킹, 예약, 단체 이용, 포장, 무선 인터넷, 유아의자 정보를 정리했습니다.",
  },
  {
    label: "네이버 리뷰",
    title: "리뷰 3,351건 기준 안내",
    description: "방문자 리뷰와 실제 방문 사진은 네이버 플레이스에서 최신 상태로 확인할 수 있게 연결했습니다.",
  },
];

export const storeHighlights = [
  {
    label: "을왕리해수욕장 인근",
    description: "해변 방문 전후로 들르기 좋은 위치입니다.",
  },
  {
    label: "조개구이 · 회 · 세트",
    description: "스페셜, 가족, 커플, 치즈가리비 세트 구성을 확인할 수 있습니다.",
  },
  {
    label: "주차 · 발렛파킹",
    description: "차량 방문 전 네이버 플레이스와 전화로 당일 가능 여부를 확인하세요.",
  },
  {
    label: "단체 · 예약 가능",
    description: "모임, 회식 등 인원수가 있는 방문은 전화 확인이 가장 정확합니다.",
  },
];

export const visitChecklist = [
  {
    label: "영업시간",
    description: "기본 시간은 평일 10:00~24:00, 금·토 10:00~02:00 기준으로 안내합니다.",
  },
  {
    label: "예약",
    description: "네이버 플레이스에서 예약 가능 여부를 확인하고, 단체는 전화 확인을 권장합니다.",
  },
  {
    label: "주차",
    description: "주차·발렛파킹 정보가 있으나 성수기와 주말에는 출발 전 확인이 필요합니다.",
  },
  {
    label: "메뉴 구성",
    description: "가격대와 세트 구성은 재료 상황에 따라 바뀔 수 있어 주문 전 확인하세요.",
  },
];

export const menuItems = [
  {
    name: "스페셜 Set",
    category: "대표 세트",
    serving: "3~4인 추천",
    price: "160,000~250,000원",
    includes: ["회", "조개구이", "해산물 구성"],
    description: "회와 조개구이, 해산물 구성을 함께 즐기기 좋은 대표 세트입니다.",
    note: "인원수와 당일 재료에 따라 세부 구성 확인 권장",
    image: assortedShellfishImage,
    alt: "동해회조개구이의 조개 모둠 사진",
    imagePosition: "center",
  },
  {
    name: "가족 Set",
    category: "세트 메뉴",
    serving: "3~4인 추천",
    price: "140,000~230,000원",
    includes: ["조개구이", "회", "식사/사이드 확인"],
    description: "여러 명이 함께 먹기 좋은 해산물 중심의 가족 방문용 세트입니다.",
    note: "가족 방문과 단체 전 주문 구성 확인 권장",
    image: sashimiImage,
    alt: "접시에 담긴 회 사진",
    imagePosition: "center",
  },
  {
    name: "커플 Set",
    category: "세트 메뉴",
    serving: "2인 추천",
    price: "100,000~170,000원",
    includes: ["조개구이", "회", "해산물"],
    description: "을왕리 해변 방문 전후로 둘이 즐기기 좋은 세트 구성입니다.",
    note: "데이트 방문자는 대기와 창가 좌석 가능 여부 확인 권장",
    image: shrimpShellfishImage,
    alt: "새우와 조개가 담긴 해산물 모둠 사진",
    imagePosition: "center 44%",
  },
  {
    name: "조개+치즈가리비 Set",
    category: "조개구이",
    serving: "2~3인 추천",
    price: "100,000~140,000원",
    includes: ["조개구이", "치즈가리비"],
    description: "조개구이와 치즈가리비를 함께 즐길 수 있는 인기 구성입니다.",
    note: "치즈가리비 포함 여부와 사이즈는 주문 전 확인",
    image: officialCheeseScallopImage,
    alt: "치즈를 올린 가리비구이와 조개구이 사진",
    imagePosition: "center 54%",
  },
  {
    name: "해물칼국수",
    category: "식사 메뉴",
    serving: "식사/마무리",
    price: "판매 여부 확인",
    includes: ["해산물", "칼국수"],
    description: "해산물과 따뜻한 국물이 어울리는 식사 메뉴입니다.",
    note: "영업일 기준 판매 여부 확인 권장",
    image: seafoodKalguksuImage,
    alt: "해물칼국수 사진",
    imagePosition: "center",
  },
  {
    name: "회무침",
    category: "회 메뉴",
    serving: "사이드/안주",
    price: "계절 변동",
    includes: ["회", "채소", "양념"],
    description: "매콤새콤한 양념과 채소를 곁들여 즐기는 메뉴입니다.",
    note: "계절과 재료 상황에 따라 변동 가능",
    image: spicyRawFishImage,
    alt: "채소와 회가 담긴 회무침 사진",
    imagePosition: "center",
  },
];

export const publicReviewItems = [];

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
    caption: "조개+치즈가리비 세트와 어울리는 메뉴 사진",
    image: officialCheeseScallopImage,
    alt: "치즈를 올린 가리비구이와 조개구이 사진",
    imagePosition: "center 54%",
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
    label: "네이버 플레이스 업체 등록 치즈가리비 사진",
    url: "https://map.naver.com/p/entry/place/37700467",
  },
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
    label: "네이버 플레이스 동해회조개구이",
    url: "https://map.naver.com/p/entry/place/37700467",
  },
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
];
