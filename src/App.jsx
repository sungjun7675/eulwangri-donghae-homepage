import { lazy, Suspense, useEffect, useState } from "react";
import MainLayout from "./components/layout/MainLayout.jsx";
import { navigationItems } from "./data/siteData.js";
import { getCurrentPageFromLocation, getPageHref, normalizeLegacyHashRoute } from "./lib/routes.js";
import Home from "./pages/Home.jsx";

const Admin = lazy(() => import("./pages/Admin.jsx"));
const availablePages = new Set([...navigationItems.map((item) => item.id), "admin"]);

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const page = normalizeLegacyHashRoute();
    return availablePages.has(page) ? page : "home";
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const page = getCurrentPageFromLocation();
      setCurrentPage(availablePages.has(page) ? page : "home");
      window.scrollTo({ top: 0, behavior: "auto" });
    };

    window.addEventListener("hashchange", handleLocationChange);
    window.addEventListener("popstate", handleLocationChange);
    window.scrollTo({ top: 0, behavior: "auto" });

    return () => {
      window.removeEventListener("hashchange", handleLocationChange);
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  const handleNavigate = (page) => {
    if (!availablePages.has(page)) {
      return;
    }

    if (page === currentPage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    window.history.pushState(null, "", getPageHref(page));
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <MainLayout currentPage={currentPage} onNavigate={handleNavigate}>
      {currentPage === "admin" ? (
        <Suspense
          fallback={
            <main className="admin-page">
              <section className="admin-card">
                <p className="section-eyebrow">Admin</p>
                <h1>관리자 화면을 불러오는 중입니다</h1>
              </section>
            </main>
          }
        >
          <Admin />
        </Suspense>
      ) : (
        <Home currentPage={currentPage} />
      )}
    </MainLayout>
  );
}
