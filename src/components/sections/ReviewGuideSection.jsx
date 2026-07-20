import { reviewSummary, siteInfo } from "../../data/siteData.js";

export default function ReviewGuideSection() {
  return (
    <section className="review-guide-section" aria-labelledby="review-guide-title">
      <div className="container review-guide-panel">
        <div>
          <p className="section-eyebrow">Naver Reviews</p>
          <h2 id="review-guide-title">네이버 플레이스에서 리뷰 확인</h2>
          <p>
            자동 리뷰 연동은 현재 보류 중입니다. 최신 방문자 리뷰, 사진, 예약 가능 여부는
            네이버 플레이스와 전화 문의를 기준으로 확인하는 구성이 가장 정확합니다.
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
        <dl className="review-guide-list" aria-label="리뷰 운영 상태">
          <div>
            <dt>{reviewSummary.provider}</dt>
            <dd>{reviewSummary.totalLabel}</dd>
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
