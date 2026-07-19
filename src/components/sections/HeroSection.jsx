import { assets, reviewSummary, siteInfo } from "../../data/siteData.js";

export default function HeroSection() {
  const reserveLinkProps = siteInfo.naverPlaceUrl
    ? { href: siteInfo.naverPlaceUrl, target: "_blank", rel: "noreferrer" }
    : { href: "#reservation" };

  return (
    <section className="hero-section" id="home" aria-labelledby="hero-title">
      <img
        className="hero-image"
        src={assets.heroImage}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
      />
      <div className="hero-vignette" aria-hidden="true" />

      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="hero-kicker">{siteInfo.tagline}</p>
          <h1 id="hero-title">{siteInfo.headline}</h1>
          <p className="hero-description">{siteInfo.description}</p>
          <div className="hero-actions">
            <a className="button button-outline" href="#menu">
              <span aria-hidden="true">◎</span>
              메뉴보기
            </a>
            <a
              className="button button-solid"
              aria-label="네이버 플레이스에서 예약 정보 확인"
              {...reserveLinkProps}
            >
              <span aria-hidden="true">N</span>
              네이버 예약하기
            </a>
          </div>
        </div>

        <aside className="review-score-card" aria-label="네이버 방문자 리뷰 요약">
          <div className="score-source">
            <span className="naver-letter">N</span>
            <span>{reviewSummary.provider}</span>
            <strong>{reviewSummary.status}</strong>
          </div>
          <div className="score-line">
            <span className="score-star" aria-hidden="true">
              ★
            </span>
            <strong>{reviewSummary.rating}</strong>
            <span>
              / {reviewSummary.denominator}
            </span>
          </div>
          <p>{reviewSummary.totalLabel}</p>
          <div className="score-divider" />
          <p className="score-rank">
            <span aria-hidden="true">◇</span>
            <small>{reviewSummary.badge}</small>
            <strong>{reviewSummary.rank}</strong>
          </p>
        </aside>

        <div className="scroll-cue" aria-hidden="true">
          <span />
          <small>SCROLL</small>
        </div>
      </div>
    </section>
  );
}
