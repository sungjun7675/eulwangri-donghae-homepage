import { menuItems } from "../../data/siteData.js";

export default function MenuSection() {
  return (
    <section className="summary-card menu-card" id="menu" aria-labelledby="menu-title">
      <div className="card-title-row">
        <h2 id="menu-title">인기 메뉴 BEST</h2>
        <a href="#menu">더보기</a>
      </div>
      <div className="menu-list">
        {menuItems.map((item) => (
          <article className="menu-item" key={item.name}>
            <div className="menu-thumb">
              <img
                src={item.image}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                style={{ objectPosition: item.imagePosition }}
              />
            </div>
            <h3>{item.name}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}
