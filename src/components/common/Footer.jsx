import { siteInfo } from "../../data/siteData.js";

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>
        <strong>{siteInfo.name}</strong>
        <span>{siteInfo.sourceNote}</span>
      </p>
      <p>운영시간, 예약 가능 여부, 메뉴 구성은 방문 전 네이버 플레이스 또는 전화로 확인하세요.</p>
    </footer>
  );
}
