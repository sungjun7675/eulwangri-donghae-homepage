import { reviewSummary, siteInfo } from "../../data/siteData.js";

export default function ReviewGuideSection() {
  return (
    <section className="review-guide-section" aria-labelledby="review-guide-title">
      <div className="container review-guide-panel">
        <div>
          <p className="section-eyebrow">Naver Reviews</p>
          <h2 id="review-guide-title">네이버 플레이스에서 리뷰 확인</h2>
          <p>
            방문자 리뷰와 실제 방문 사진은 네이버 플레이스에서 가장 최신 상태로 확인할 수
            있습니다. 예약 가능 여부와 당일 영업 상태도 방문 전 함께 확인하세요.
          </p>
        </div>
        <div className="review-guide-actions">
          <a className="button button-solid" href={siteInfo.naverPlaceUrl} target="_blank" rel="noreferrer">
            <span aria-hidden="true">N</span>
            네이버 리뷰 확인
          </a>
          <a className="button button-outline" href={`tel:${siteInfo.phone.replaceAll("-", "")}`}>
            전화 문의
          </a>
        </div>
        <dl className="review-guide-list" aria-label="네이버 리뷰 정보">
          <div>
            <dt>{reviewSummary.provider}</dt>
            <dd>{reviewSummary.headline}</dd>
          </div>
          <div>
            <dt>{reviewSummary.totalLabel}</dt>
            <dd>{reviewSummary.status}</dd>
          </div>
          <div>
            <dt>{reviewSummary.badge}</dt>
            <dd>{reviewSummary.rank}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
