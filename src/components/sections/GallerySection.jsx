import { galleryItems } from "../../data/siteData.js";

const imagePositionClassMap = {
  "center 44%": "image-position-center-44",
  "center 54%": "image-position-center-54",
};

const getImagePositionClass = (position) => imagePositionClassMap[position] || "";

export default function GallerySection() {
  return (
    <section className="gallery-section" aria-labelledby="gallery-title">
      <div className="container">
        <div className="section-title compact">
          <p className="section-eyebrow">Gallery</p>
          <h2 id="gallery-title">사진으로 보는 동해</h2>
        </div>
        <div className="gallery-grid">
          {galleryItems.map((item) => (
            <figure className="gallery-card" key={item.name}>
              <img
                className={`gallery-tile ${getImagePositionClass(item.imagePosition)}`.trim()}
                src={item.image}
                alt={item.alt}
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                <strong>{item.name}</strong>
                <span>{item.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
