import { useEffect, useRef } from "react";
import { liveReviews, siteInfo } from "../../data/siteData.js";
import useReviews from "../../hooks/useReviews.js";

const AUTO_SCROLL_INTERVAL_MS = 3200;

const scrollByCard = (element, direction) => {
  if (!element) {
    return;
  }

  element.scrollBy({
    left: direction * Math.min(340, element.clientWidth * 0.8),
    behavior: "smooth",
  });
};

export default function LiveReviewSection() {
  const reviewListRef = useRef(null);
  const { reviews: connectedReviews, isLoading } = useReviews();
  const hasConnectedReviews = connectedReviews.length > 0;
  const reviews = hasConnectedReviews ? connectedReviews : liveReviews;
  const shouldAutoScroll = reviews.length > 1;

  useEffect(() => {
    if (!shouldAutoScroll) {
      return undefined;
    }

    const reviewList = reviewListRef.current;

    if (!reviewList) {
      return undefined;
    }

    const autoScrollTimer = window.setInterval(() => {
      const maxScrollLeft = reviewList.scrollWidth - reviewList.clientWidth;
      const isAtEnd = reviewList.scrollLeft >= maxScrollLeft - 8;

      if (isAtEnd) {
        reviewList.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }

      scrollByCard(reviewList, 1);
    }, AUTO_SCROLL_INTERVAL_MS);

    return () => {
      window.clearInterval(autoScrollTimer);
    };
  }, [reviews.length, shouldAutoScroll]);

  return (
    <section className="live-review-section" id="reviews" aria-labelledby="live-review-title">
      <div className="container">
        <div className="live-review-panel">
          <div className="review-panel-header">
            <div>
              <h2 id="live-review-title">
                네이버 리뷰 영역 <span>{hasConnectedReviews ? "연동" : "시안"}</span>
              </h2>
              <p>
                {isLoading
                  ? "연결된 리뷰 데이터를 불러오는 중입니다."
                  : hasConnectedReviews
                    ? "Supabase에 등록된 공개 리뷰 데이터를 표시합니다."
                    : "공식 리뷰 연동 전까지 실제 후기처럼 표시하지 않습니다."}
              </p>
            </div>
            <a href={siteInfo.naverPlaceUrl} target="_blank" rel="noreferrer">
              네이버에서 확인
            </a>
          </div>

          <div className="review-carousel-wrap">
            <button
              className="carousel-button carousel-button-prev"
              type="button"
              aria-label="이전 리뷰 보기"
              onClick={() => scrollByCard(reviewListRef.current, -1)}
            >
              ‹
            </button>
            <div className="review-carousel" ref={reviewListRef} tabIndex="0">
              {reviews.map((review) => (
                <article className="review-card" key={review.id}>
                  <div className="review-stars" aria-label={review.label ?? `별점 ${review.rating ?? 5}점`}>
                    {review.label ?? "★★★★★"}
                  </div>
                  <p>{review.text}</p>
                  <footer>
                    <strong>{review.author}</strong>
                    <span>{review.time ?? "최근 리뷰"}</span>
                  </footer>
                </article>
              ))}
            </div>
            <button
              className="carousel-button carousel-button-next"
              type="button"
              aria-label="다음 리뷰 보기"
              onClick={() => scrollByCard(reviewListRef.current, 1)}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
