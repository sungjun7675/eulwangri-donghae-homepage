import { siteInfo } from "../../data/siteData.js";

export default function MobileActionBar() {
  const phoneHref = `tel:${siteInfo.phone.replaceAll("-", "")}`;

  return (
    <nav className="mobile-action-bar" aria-label="모바일 빠른 작업">
      <a href={phoneHref}>
        <span aria-hidden="true">☎</span>
        전화
      </a>
      <a href={siteInfo.naverPlaceUrl} target="_blank" rel="noreferrer">
        <span aria-hidden="true">N</span>
        네이버
      </a>
      <a href={siteInfo.directionsUrl} target="_blank" rel="noreferrer">
        <span aria-hidden="true">⌖</span>
        길찾기
      </a>
    </nav>
  );
}
