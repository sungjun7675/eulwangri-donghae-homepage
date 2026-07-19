import Footer from "../common/Footer.jsx";
import Header from "../common/Header.jsx";
import TopButton from "../common/TopButton.jsx";

export default function MainLayout({ children }) {
  return (
    <div className="site-shell">
      <Header />
      <main>{children}</main>
      <Footer />
      <TopButton />
    </div>
  );
}
