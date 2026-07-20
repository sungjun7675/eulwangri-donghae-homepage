import { localSeoItems, reviewSummary, siteInfo } from "../../data/siteData.js";

export default function LocalInfoSection() {
  return (
    <section className="local-info-section" aria-labelledby="local-info-title">
      <div className="container local-info-inner">
        <div className="local-info-copy">
          <p className="section-eyebrow">Eulwangri Seafood</p>
          <h2 id="local-info-title">을왕리해수욕장 인근 조개구이 방문 안내</h2>
          <p>
            을왕리 동해회조개구이는 인천 영종구 을왕로 62에 위치한 조개구이·회·해산물
            매장입니다. 네이버 검색 결과 기준 리뷰 수, 메뉴 가격대, 주차와 예약 편의 정보를
            확인해 방문 전 필요한 정보를 빠르게 살필 수 있습니다.
          </p>
          <div className="local-info-actions">
            <a className="button button-solid" href={siteInfo.naverPlaceUrl} target="_blank" rel="noreferrer">
              네이버 플레이스 확인
            </a>
            <a className="button button-outline" href={siteInfo.directionsUrl} target="_blank" rel="noreferrer">
              길찾기
            </a>
          </div>
        </div>

        <div className="local-info-summary" aria-label="네이버 기준 핵심 정보">
          <strong>{reviewSummary.headline}</strong>
          <span>{reviewSummary.status}</span>
          <small>{reviewSummary.totalLabel}</small>
        </div>

        <div className="local-info-grid">
          {localSeoItems.map((item) => (
            <article key={item.label}>
              <span>{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
