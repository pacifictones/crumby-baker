import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Breadcrumbs from "./Breadcrumbs";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col ">
      <Navbar />
      <Breadcrumbs />
      <main className="flex-1 w-full ">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;

//
