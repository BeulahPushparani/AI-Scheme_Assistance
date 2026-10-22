import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* Spacer for fixed navbar height */}
      <div className="h-16" aria-hidden="true" />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}