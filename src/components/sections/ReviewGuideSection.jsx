import { publicReviewItems, reviewSummary, siteInfo } from "../../data/siteData.js";

export default function ReviewGuideSection({ variant = "full" }) {
  const isCompact = variant === "compact";
  const reviews = isCompact ? publicReviewItems.slice(0, 3) : publicReviewItems;

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
              자동 크롤링 없이, 사용자가 제공한 캡처와 공개 확인 가능한 정보만 정리했습니다. 별점, 작성자 표기,
              날짜, 사진은 확인된 범위 안에서만 노출합니다.
            </p>
          </div>
          <div className="public-review-summary">
            <strong>{reviewSummary.headline}</strong>
            <span>{reviewSummary.totalLabel}</span>
            <small>{reviewSummary.status}</small>
          </div>
        </div>

        <div className="public-review-grid" aria-label="대표 방문자 리뷰">
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

        <div className="public-review-actions">
          <p>리뷰 평점과 전체 리뷰는 네이버 플레이스에서 최신 상태를 확인하세요.</p>
          <a className="button button-solid" href={siteInfo.naverPlaceUrl} target="_blank" rel="noreferrer">
            <span aria-hidden="true">N</span>
            네이버 리뷰 확인
          </a>
        </div>
      </div>
    </section>
  );
}
