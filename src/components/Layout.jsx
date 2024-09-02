import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col ">
      <Header />
      <main className="flex-1 w-full lg:max-w-screen-lg md:max-w-screen-md  px-4 py-8 mx-auto bg-white text-black">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
