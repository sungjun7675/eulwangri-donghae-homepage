import { businessInfoSources, photoSources, siteInfo } from "../../data/siteData.js";

export default function NoticeSection() {
  const sourceLinks = [...photoSources, ...businessInfoSources];

  return (
    <section className="notice-section" aria-label="정보 출처 안내">
      <div className="container notice-inner">
        <strong>정보 출처 안내</strong>
        <p>
          주소, 연락처, 리뷰 수, 메뉴 가격대와 사진은 네이버 검색 결과 및 공개 출처를 기준으로
          반영했습니다. {siteInfo.businessHoursNote}. 평점과 세부 리뷰 내용은 네이버 플레이스에서
          최신 상태를 확인하세요.
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
