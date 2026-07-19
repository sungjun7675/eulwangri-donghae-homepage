import Footer from "../common/Footer.jsx";
import Header from "../common/Header.jsx";
import MobileActionBar from "../common/MobileActionBar.jsx";
import StructuredData from "../common/StructuredData.jsx";
import TopButton from "../common/TopButton.jsx";

export default function MainLayout({ children, currentPage }) {
  return (
    <div className="site-shell">
      <StructuredData />
      <Header currentPage={currentPage} />
      <main>{children}</main>
      <Footer />
      <MobileActionBar />
      <TopButton />
    </div>
  );
}
