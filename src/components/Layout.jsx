import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col ">
      <Navbar />
      <main className="flex-1 w-full max-w-screen-lg  px-4 py-8 mx-auto bg-white ">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
