import { siteInfo } from "../../data/siteData.js";

export default function StructuredData() {
  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: siteInfo.name,
    description: siteInfo.description,
    url: siteInfo.siteUrl,
    telephone: siteInfo.phone,
    servesCuisine: ["조개구이", "회", "해산물"],
    priceRange: "방문 전 확인",
    address: {
      "@type": "PostalAddress",
      streetAddress: "을왕로 62",
      addressLocality: "중구",
      addressRegion: "인천",
      addressCountry: "KR",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Sunday"],
        opens: "10:00",
        closes: "22:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Friday", "Saturday"],
        opens: "10:00",
        closes: "01:00",
      },
    ],
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteInfo.latitude,
      longitude: siteInfo.longitude,
    },
    hasMap: siteInfo.directionsUrl,
    sameAs: [siteInfo.naverPlaceUrl],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
    />
  );
}
