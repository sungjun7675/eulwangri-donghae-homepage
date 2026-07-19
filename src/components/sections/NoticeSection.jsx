import { businessInfoSources, photoSources, siteInfo } from "../../data/siteData.js";

export default function NoticeSection() {
  const sourceLinks = [...photoSources, ...businessInfoSources];

  return (
    <section className="notice-section" aria-label="시안 데이터 안내">
      <div className="container notice-inner">
        <strong>시안 데이터 안내</strong>
        <p>
          사진은 공개 검색 결과에서 확인한 실제 매장 사진으로 교체했고, 주소와 연락처는 공개
          출처 기준으로 반영했습니다. {siteInfo.businessHoursNote}. 평점, 리뷰 수, 순위는 아직
          시안 표시값입니다.
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
