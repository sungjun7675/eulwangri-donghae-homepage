import { siteInfo } from "../../data/siteData.js";

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>
        <strong>{siteInfo.name}</strong>
        <span>{siteInfo.sourceNote}</span>
      </p>
      <p>리뷰 평점과 리뷰 수는 공식 연동 전까지 시안 값으로 표시합니다.</p>
    </footer>
  );
}
