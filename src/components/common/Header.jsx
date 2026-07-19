import { useState } from "react";
import { navigationItems, siteInfo } from "../../data/siteData.js";

export default function Header({ currentPage = "home" }) {
  const [isOpen, setIsOpen] = useState(false);
  const reserveLinkProps = siteInfo.naverPlaceUrl
    ? { href: siteInfo.naverPlaceUrl, target: "_blank", rel: "noreferrer" }
    : { href: "#reservation" };

  const handleNavClick = (event, item) => {
    setIsOpen(false);

    if (item.id === currentPage) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="site-header">
      <a
        className="brand"
        href="#home"
        aria-label="을왕리 동해회조개구이 홈"
        onClick={(event) => handleNavClick(event, { id: "home" })}
      >
        <span className="brand-mark" aria-hidden="true">
          동해
        </span>
        <span className="brand-text">
          <strong>{siteInfo.name}</strong>
          <small>{siteInfo.romanName}</small>
        </span>
      </a>

      <button
        className="mobile-menu-button"
        type="button"
        aria-expanded={isOpen}
        aria-controls="primary-navigation"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span aria-hidden="true">{isOpen ? "닫기" : "메뉴"}</span>
      </button>

      <nav
        id="primary-navigation"
        className={`primary-nav ${isOpen ? "is-open" : ""}`}
        aria-label="주요 메뉴"
      >
        {navigationItems.map((item) => (
          <a
            className={item.id === currentPage ? "is-active" : undefined}
            aria-current={item.id === currentPage ? "page" : undefined}
            key={item.href}
            href={item.href}
            onClick={(event) => handleNavClick(event, item)}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <a
        className="naver-reserve header-reserve"
        aria-label="네이버 플레이스에서 예약 정보 확인"
        {...reserveLinkProps}
      >
        <span aria-hidden="true">N</span>
        네이버 예약
      </a>
    </header>
  );
}
