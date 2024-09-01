import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
      <Header />
      <main className="p-8 bg-white">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
