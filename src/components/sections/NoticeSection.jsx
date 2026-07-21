import { businessInfoSources, photoSources, siteInfo } from "../../data/siteData.js";

export default function NoticeSection() {
  const sourceLinks = [...photoSources, ...businessInfoSources];

  return (
    <section className="notice-section" aria-label="정보 출처 안내">
      <div className="container notice-inner">
        <strong>정보 출처 안내</strong>
        <p>
          주소, 연락처, 메뉴, 리뷰, 사진 정보는 네이버 플레이스와 공개 검색 결과를 기준으로 반영했습니다.
          {` ${siteInfo.businessHoursNote}. `}
          평점, 리뷰 수, 예약 가능 여부는 네이버 플레이스에서 최신 상태를 확인하세요.
        </p>
        <ul aria-label="사진 및 매장 정보 출처">
          {sourceLinks.map((source) => (
            <li key={`${source.label}-${source.url}`}>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
