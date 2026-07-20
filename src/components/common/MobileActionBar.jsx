import { siteInfo } from "../../data/siteData.js";

export default function MobileActionBar() {
  const phoneHref = `tel:${siteInfo.phone.replaceAll("-", "")}`;

  return (
    <nav className="mobile-action-bar" aria-label="모바일 빠른 작업">
      <a href={phoneHref} aria-label={`${siteInfo.name} 전화 문의`}>
        <span aria-hidden="true">☎</span>
        전화
      </a>
      <a
        href={siteInfo.naverPlaceUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="네이버 플레이스에서 예약과 리뷰 확인"
      >
        <span aria-hidden="true">N</span>
        예약
      </a>
      <a
        href={siteInfo.directionsUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="네이버 지도 길찾기 열기"
      >
        <span aria-hidden="true">⌖</span>
        길찾기
      </a>
    </nav>
  );
}
