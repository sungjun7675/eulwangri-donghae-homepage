import { reviewSummary, siteInfo, visitChecklist } from "../../data/siteData.js";

export default function ReservationSection() {
  return (
    <section className="reservation-section" id="reservation" aria-labelledby="reservation-title">
      <div className="container reservation-inner">
        <div>
          <p className="section-eyebrow">예약 안내</p>
          <h2 id="reservation-title">네이버 플레이스에서 예약 정보를 확인하세요</h2>
          <p>
            네이버 검색 결과 기준 예약, 주차, 발렛파킹, 단체 이용 정보를 확인했습니다. 출발 전
            당일 영업 상태와 예약 가능 여부는 네이버 플레이스 또는 전화로 확인하세요.
          </p>
          <div className="reservation-meta-row" aria-label="방문 전 확인 정보">
            <span>{reviewSummary.headline}</span>
            <span>주차·발렛파킹</span>
            <span>단체·예약 가능</span>
          </div>
        </div>
        <div className="reservation-actions">
          <a
            className="button button-solid"
            href={siteInfo.naverPlaceUrl}
            target="_blank"
            rel="noreferrer"
          >
            네이버 예약·리뷰 확인
          </a>
          <a className="button button-outline" href={`tel:${siteInfo.phone.replaceAll("-", "")}`}>
            전화로 영업 확인
          </a>
        </div>
        <div className="visit-check-grid">
          {visitChecklist.map((item) => (
            <article key={item.label}>
              <strong>{item.label}</strong>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
