import { useState } from "react";
import { siteInfo } from "../../data/siteData.js";

export default function MapSection() {
  const [isCopied, setIsCopied] = useState(false);
  const coordinateText = siteInfo.coordinateLabel || `${siteInfo.latitude}, ${siteInfo.longitude}`;

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
      <div className="naver-location-panel" aria-label="네이버 지도 기준 위치 정보">
        <div className="naver-location-head">
          <span className="naver-location-logo" aria-hidden="true">
            N
          </span>
          <div>
            <strong>네이버 지도 기준 위치</strong>
            <span>Place ID {siteInfo.naverPlaceId}</span>
          </div>
        </div>
        <div className="naver-coordinate-box">
          <span>정확 좌표</span>
          <strong>{coordinateText}</strong>
          <p>
            네이버 플레이스 장소 ID와 좌표를 기준으로 연결합니다. 실제 길찾기, 교통, 주차 상황은 네이버
            지도에서 확인하세요.
          </p>
        </div>
        <div className="naver-place-summary">
          <p>
            <span>주소</span>
            <strong>{siteInfo.address}</strong>
          </p>
          <p>
            <span>위치</span>
            <strong>{siteInfo.locationHint}</strong>
          </p>
        </div>
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
          <strong>정확도 기준</strong>
          <span>네이버 플레이스 장소 ID {siteInfo.naverPlaceId}와 좌표 {coordinateText} 기준으로 연결합니다.</span>
        </p>
        <p>
          <strong>실시간 길찾기</strong>
          <span>교통, 주차, 도착지 입구는 네이버 지도에서 실시간으로 다시 확인하는 구조입니다.</span>
        </p>
      </div>
    </section>
  );
}
