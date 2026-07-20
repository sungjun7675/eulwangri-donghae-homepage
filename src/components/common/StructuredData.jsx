import { siteInfo } from "../../data/siteData.js";

export default function StructuredData() {
  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: siteInfo.name,
    description: siteInfo.description,
    url: siteInfo.siteUrl,
    image: `${siteInfo.siteUrl}og-hero-cinematic.jpg`,
    telephone: siteInfo.phone,
    servesCuisine: ["조개구이", "회", "해산물"],
    priceRange: "₩₩₩",
    acceptsReservations: true,
    address: {
      "@type": "PostalAddress",
      streetAddress: "을왕로 62",
      addressLocality: "영종구",
      addressRegion: "인천",
      addressCountry: "KR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteInfo.latitude,
      longitude: siteInfo.longitude,
    },
    hasMap: siteInfo.directionsUrl,
    sameAs: [siteInfo.naverPlaceUrl],
    menu: siteInfo.naverPlaceUrl,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
    />
  );
}
