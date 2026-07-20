import { siteInfo } from "../../data/siteData.js";

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>
        <strong>{siteInfo.name}</strong>
        <span>{siteInfo.sourceNote}</span>
      </p>
      <p>리뷰와 예약 가능 여부는 네이버 플레이스 또는 전화 문의로 확인하세요.</p>
    </footer>
  );
}
