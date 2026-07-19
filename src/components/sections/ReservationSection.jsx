import { siteInfo } from "../../data/siteData.js";

export default function ReservationSection() {
  return (
    <section className="reservation-section" id="reservation" aria-labelledby="reservation-title">
      <div className="container reservation-inner">
        <div>
          <p className="section-eyebrow">예약 안내</p>
          <h2 id="reservation-title">네이버 플레이스에서 예약 정보를 확인하세요</h2>
          <p>
            공개 출처에서 확인한 네이버 플레이스 링크를 연결했습니다. 출발 전 영업시간과 예약
            가능 여부는 전화로 한 번 더 확인하는 구성이 안전합니다.
          </p>
        </div>
        <div className="reservation-actions">
          <a
            className="button button-solid"
            href={siteInfo.naverPlaceUrl}
            target="_blank"
            rel="noreferrer"
          >
            네이버에서 확인
          </a>
          <a className="button button-outline" href={`tel:${siteInfo.phone.replaceAll("-", "")}`}>
            전화 문의
          </a>
        </div>
      </div>
    </section>
  );
}
