import GallerySection from "../components/sections/GallerySection.jsx";
import HeroSection from "../components/sections/HeroSection.jsx";
import MapSection from "../components/sections/MapSection.jsx";
import MenuSection from "../components/sections/MenuSection.jsx";
import NoticeSection from "../components/sections/NoticeSection.jsx";
import ReservationSection from "../components/sections/ReservationSection.jsx";
import ReviewGuideSection from "../components/sections/ReviewGuideSection.jsx";
import ReviewSection from "../components/sections/ReviewSection.jsx";
import StoreInfoSection from "../components/sections/StoreInfoSection.jsx";

const pageCopy = {
  menu: {
    eyebrow: "Menu",
    title: "동해회조개구이 메뉴",
    description: "대표 메뉴와 실제 음식 사진을 한 화면에서 확인할 수 있도록 구성했습니다.",
  },
  store: {
    eyebrow: "Store",
    title: "매장소개",
    description: "주소, 전화번호, 영업시간과 매장 분위기를 한 화면에서 확인하세요.",
  },
  reviews: {
    eyebrow: "Reviews",
    title: "방문자 리뷰",
    description: "네이버 플레이스 기준 최신 리뷰와 방문자 사진을 확인할 수 있도록 연결했습니다.",
  },
  location: {
    eyebrow: "Location",
    title: "찾아오시는길",
    description: "을왕리해수욕장 인근 위치와 길찾기, 전화, 주소복사를 제공합니다.",
  },
  reservation: {
    eyebrow: "Guide",
    title: "이용안내",
    description: "예약, 영업 상태, 메뉴 가격대와 방문 전 확인 사항을 한 화면에 정리했습니다.",
  },
};

function PageView({ page, children }) {
  const copy = pageCopy[page];

  return (
    <section className={`subpage-view subpage-${page}`} aria-labelledby="subpage-title">
      <div className="container subpage-heading">
        <p className="section-eyebrow">{copy.eyebrow}</p>
        <h1 id="subpage-title">{copy.title}</h1>
        <p>{copy.description}</p>
      </div>
      <div className="subpage-content">{children}</div>
    </section>
  );
}

function HomeView() {
  return (
    <>
      <HeroSection />
      <ReviewSection />
    </>
  );
}

export default function Home({ currentPage = "home" }) {
  if (currentPage === "menu") {
    return (
      <PageView page="menu">
        <div className="container subpage-card-grid">
          <MenuSection variant="full" />
        </div>
        <GallerySection />
      </PageView>
    );
  }

  if (currentPage === "store") {
    return (
      <PageView page="store">
        <div className="container subpage-card-grid">
          <StoreInfoSection />
        </div>
        <GallerySection />
      </PageView>
    );
  }

  if (currentPage === "reviews") {
    return (
      <PageView page="reviews">
        <ReviewGuideSection />
        <ReviewSection />
      </PageView>
    );
  }

  if (currentPage === "location") {
    return (
      <PageView page="location">
        <div className="container subpage-card-grid">
          <MapSection />
          <StoreInfoSection />
        </div>
      </PageView>
    );
  }

  if (currentPage === "reservation") {
    return (
      <PageView page="reservation">
        <ReservationSection />
        <NoticeSection />
      </PageView>
    );
  }

  return <HomeView />;
}
