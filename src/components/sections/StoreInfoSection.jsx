import { assets, siteInfo, storeHighlights } from "../../data/siteData.js";

export default function StoreInfoSection() {
  return (
    <section className="summary-card store-card" id="store" aria-labelledby="store-title">
      <div className="store-details">
        <h2 id="store-title">매장 정보</h2>
        <dl>
          <div>
            <dt>
              <span aria-hidden="true">⌖</span>
              주소
            </dt>
            <dd>{siteInfo.address}</dd>
          </div>
          <div>
            <dt>
              <span aria-hidden="true">☎</span>
              전화번호
            </dt>
            <dd>
              <a href={`tel:${siteInfo.phone.replaceAll("-", "")}`}>{siteInfo.phone}</a>
            </dd>
          </div>
          <div>
            <dt>
              <span aria-hidden="true">◷</span>
              영업시간
            </dt>
            <dd>
              {siteInfo.businessHours}
              <small>{siteInfo.businessHoursNote}</small>
            </dd>
          </div>
        </dl>
        <div className="store-highlight-list" aria-label="매장 핵심 안내">
          {storeHighlights.map((highlight) => (
            <article key={highlight.label}>
              <strong>{highlight.label}</strong>
              <p>{highlight.description}</p>
            </article>
          ))}
        </div>
      </div>
      <img
        src={assets.storeImage}
        alt="바닷가 근처의 야간 해산물 식당 외관 시안 이미지"
        loading="lazy"
        decoding="async"
      />
    </section>
  );
}
