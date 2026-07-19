import GallerySection from "../components/sections/GallerySection.jsx";
import HeroSection from "../components/sections/HeroSection.jsx";
import LiveReviewSection from "../components/sections/LiveReviewSection.jsx";
import MapSection from "../components/sections/MapSection.jsx";
import MenuSection from "../components/sections/MenuSection.jsx";
import NoticeSection from "../components/sections/NoticeSection.jsx";
import ReservationSection from "../components/sections/ReservationSection.jsx";
import ReviewSection from "../components/sections/ReviewSection.jsx";
import StoreInfoSection from "../components/sections/StoreInfoSection.jsx";

export default function Home() {
  return (
    <>
      <HeroSection />
      <LiveReviewSection />
      <ReviewSection />
      <div className="container dashboard-grid">
        <MenuSection />
        <StoreInfoSection />
        <MapSection />
      </div>
      <ReservationSection />
      <GallerySection />
      <NoticeSection />
    </>
  );
}
