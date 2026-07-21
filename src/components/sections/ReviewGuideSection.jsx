import { commercialReviewPolicy, publicReviewItems, reviewSummary, siteInfo } from "../../data/siteData.js";

export default function ReviewGuideSection({ variant = "full" }) {
  const isCompact = variant === "compact";
  const approvedReviews = publicReviewItems.filter((review) => review.isCommercialUseApproved === true);
  const reviews = isCompact ? approvedReviews.slice(0, 3) : approvedReviews;

  return (
    <section
      className={`review-guide-section public-review-section ${isCompact ? "public-review-compact" : ""}`}
      aria-labelledby="review-guide-title"
    >
      <div className="container public-review-panel">
        <div className="public-review-header">
          <div>
            <p className="section-eyebrow">Visitor Reviews</p>
            <h2 id="review-guide-title">방문자가 남긴 네이버 리뷰 흐름</h2>
            <p>
              네이버 리뷰 원문과 방문 사진은 권리 확인이 끝난 항목만 홈페이지에 노출합니다. 최신 리뷰와 사진은
              네이버 플레이스에서 직접 확인할 수 있습니다.
            </p>
          </div>
          <div className="public-review-summary">
            <strong>{reviewSummary.headline}</strong>
            <span>{reviewSummary.totalLabel}</span>
            <small>{reviewSummary.status}</small>
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="public-review-grid" aria-label="상업 사용 허락 확인 완료 리뷰">
            {reviews.map((review) => (
              <article className="public-review-card" key={`${review.author}-${review.date}`}>
                {review.image ? (
                  <img
                    className="public-review-photo"
                    src={review.image}
                    alt={review.imageAlt || `${review.author} 리뷰 사진`}
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
                <div className="public-review-copy">
                  <div className="review-stars" aria-label={`${review.rating}점 만점 리뷰`}>
                    {"★".repeat(review.rating)}
                  </div>
                  <p>{review.text}</p>
                  <footer>
                    <strong>{review.author}</strong>
                    <span>{review.date}</span>
                    <small>{review.source}</small>
                  </footer>
                  {review.tags?.length ? (
                    <div className="review-tag-row" aria-label="리뷰 키워드">
                      {review.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="public-review-safe-grid" aria-label="리뷰 공개 운영 기준">
            <div className="public-review-safe-card public-review-safe-card-primary">
              <span>Review Policy</span>
              <h3>{commercialReviewPolicy.heading}</h3>
              <p>{commercialReviewPolicy.description}</p>
            </div>
            {commercialReviewPolicy.items.map((item) => (
              <div className="public-review-safe-card" key={item.label}>
                <span>{item.label}</span>
                <p>{item.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="public-review-actions">
          <p>방문자 리뷰, 리뷰 사진, 예약 가능 여부는 네이버 플레이스 원문 화면에서 최신 상태를 확인하세요.</p>
          <a className="button button-solid" href={siteInfo.naverPlaceUrl} target="_blank" rel="noreferrer">
            <span aria-hidden="true">N</span>
            네이버 리뷰 확인
          </a>
        </div>
      </div>
    </section>
  );
}
