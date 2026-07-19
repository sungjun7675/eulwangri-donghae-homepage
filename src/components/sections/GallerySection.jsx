import { galleryItems } from "../../data/siteData.js";

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
            <img
              className="gallery-tile"
              key={item.name}
              src={item.image}
              alt={item.alt}
              style={{ objectPosition: item.imagePosition }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
