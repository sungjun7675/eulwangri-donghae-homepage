import { menuItems } from "../../data/siteData.js";

const getImagePositionClass = (position) => (position === "center 44%" ? "image-position-center-44" : "");

export default function MenuSection({ variant = "compact" }) {
  const isFull = variant === "full";

  return (
    <section
      className={`summary-card menu-card ${isFull ? "menu-card-full" : ""}`}
      id="menu"
      aria-labelledby="menu-title"
    >
      <div className="card-title-row">
        <h2 id="menu-title">인기 메뉴 BEST</h2>
        <a href="https://map.naver.com/p/entry/place/37700467" target="_blank" rel="noreferrer">
          네이버 메뉴 확인
        </a>
      </div>
      {isFull ? (
        <>
          <p className="menu-card-intro">
            실제 가격과 세트 구성은 네이버 플레이스 또는 전화로 확인하는 방식이 가장 정확합니다.
          </p>
          <div className="menu-detail-grid">
            {menuItems.map((item) => (
              <article className="menu-detail-item" key={item.name}>
                <div className="menu-detail-image">
                  <img
                    className={getImagePositionClass(item.imagePosition)}
                    src={item.image}
                    alt={item.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="menu-detail-copy">
                  <span>{item.category}</span>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <small>{item.note}</small>
                </div>
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="menu-list">
          {menuItems.map((item) => (
            <article className="menu-item" key={item.name}>
              <div className="menu-thumb">
                <img
                  className={getImagePositionClass(item.imagePosition)}
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <h3>{item.name}</h3>
            </article>
          ))}
        </div>
      )}
      {isFull ? (
        <div className="menu-verify-row">
          <p>메뉴 정보는 실제 운영 상황에 따라 바뀔 수 있습니다.</p>
          <a href="tel:050713952840">전화로 메뉴 확인</a>
        </div>
      ) : null}
    </section>
  );
}
