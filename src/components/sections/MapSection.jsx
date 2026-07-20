import { useState } from "react";
import { siteInfo } from "../../data/siteData.js";

export default function MapSection() {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(siteInfo.address);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 1800);
    } catch {
      setIsCopied(false);
    }
  };

  return (
    <section className="summary-card map-card" id="location" aria-labelledby="location-title">
      <div className="card-title-row">
        <h2 id="location-title">찾아오시는길</h2>
        <a href={siteInfo.naverPlaceUrl} target="_blank" rel="noreferrer">
          네이버 지도
        </a>
      </div>
      <div className="map-preview" role="img" aria-label="을왕리 해변 인근 위치 안내 지도">
        <span className="map-water" />
        <span className="map-land" />
        <span className="map-road map-road-main" />
        <span className="map-road map-road-side" />
        <span className="map-label map-label-beach">을왕리해수욕장</span>
        <span className="map-label map-label-store">동해회조개구이</span>
        <span className="map-pin" />
      </div>
      <div className="map-info-panel">
        <p>
          <strong>{siteInfo.address}</strong>
          <span>{siteInfo.locationHint}</span>
        </p>
        <div className="map-action-row">
          <a className="map-action map-action-primary" href={siteInfo.directionsUrl} target="_blank" rel="noreferrer">
            길찾기
          </a>
          <a className="map-action" href={`tel:${siteInfo.phone.replaceAll("-", "")}`}>
            전화
          </a>
          <button className="map-action" type="button" onClick={handleCopyAddress}>
            {isCopied ? "복사완료" : "주소복사"}
          </button>
        </div>
      </div>
      <div className="route-note-list" aria-label="방문 전 확인 사항">
        <p>
          <strong>방문 전 체크</strong>
          <span>네이버 지도에서 실시간 길찾기를 확인하고, 출발 전 영업 여부를 전화로 확인하세요.</span>
        </p>
        <p>
          <strong>주소 기준</strong>
          <span>{siteInfo.locationHint} 위치로 안내합니다.</span>
        </p>
      </div>
    </section>
  );
}
