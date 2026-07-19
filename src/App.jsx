import { useEffect, useState } from "react";
import MainLayout from "./components/layout/MainLayout.jsx";
import { navigationItems } from "./data/siteData.js";
import Admin from "./pages/Admin.jsx";
import Home from "./pages/Home.jsx";

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
      {currentPage === "admin" ? <Admin /> : <Home currentPage={currentPage} />}
    </MainLayout>
  );
}
