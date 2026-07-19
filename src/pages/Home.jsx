import GallerySection from "../components/sections/GallerySection.jsx";
import HeroSection from "../components/sections/HeroSection.jsx";
import LiveReviewSection from "../components/sections/LiveReviewSection.jsx";
import MapSection from "../components/sections/MapSection.jsx";
import MenuSection from "../components/sections/MenuSection.jsx";
import NoticeSection from "../components/sections/NoticeSection.jsx";
import ReservationSection from "../components/sections/ReservationSection.jsx";
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
    description: "Supabase에 등록된 실제 공개 리뷰가 있으면 최신순으로 자동 표시됩니다.",
  },
  location: {
    eyebrow: "Location",
    title: "찾아오시는길",
    description: "을왕리해수욕장 인근 위치와 길찾기, 전화, 주소복사를 제공합니다.",
  },
  reservation: {
    eyebrow: "Guide",
    title: "이용안내",
    description: "예약 확인, 전화 문의, 데이터 출처 안내를 한 화면에 정리했습니다.",
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
      <LiveReviewSection />
      <ReviewSection />
    </>
  );
}

export default function Home({ currentPage = "home" }) {
  if (currentPage === "menu") {
    return (
      <PageView page="menu">
        <div className="container subpage-card-grid">
          <MenuSection />
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
        <LiveReviewSection />
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
