import { lazy, Suspense, useEffect, useState } from "react";
import MainLayout from "./components/layout/MainLayout.jsx";
import { navigationItems } from "./data/siteData.js";
import Home from "./pages/Home.jsx";

const Admin = lazy(() => import("./pages/Admin.jsx"));
const availablePages = new Set([...navigationItems.map((item) => item.id), "admin"]);

function getCurrentPageFromHash() {
  const page = window.location.hash.replace("#", "") || "home";

  return availablePages.has(page) ? page : "home";
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(getCurrentPageFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getCurrentPageFromHash());
      window.scrollTo({ top: 0, behavior: "auto" });
    };

    window.addEventListener("hashchange", handleHashChange);
    window.scrollTo({ top: 0, behavior: "auto" });

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <MainLayout currentPage={currentPage}>
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
