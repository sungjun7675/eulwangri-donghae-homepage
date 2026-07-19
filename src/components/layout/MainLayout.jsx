import Footer from "../common/Footer.jsx";
import Header from "../common/Header.jsx";
import MobileActionBar from "../common/MobileActionBar.jsx";
import StructuredData from "../common/StructuredData.jsx";
import TopButton from "../common/TopButton.jsx";

export default function MainLayout({ children, currentPage }) {
  const isAdminPage = currentPage === "admin";

  return (
    <div className={`site-shell ${isAdminPage ? "site-shell-admin" : ""}`}>
      <StructuredData />
      <Header currentPage={currentPage} />
      <main className={isAdminPage ? "admin-main" : undefined}>{children}</main>
      <Footer />
      {!isAdminPage ? <MobileActionBar /> : null}
      {!isAdminPage ? <TopButton /> : null}
    </div>
  );
}
