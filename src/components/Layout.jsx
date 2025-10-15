import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Breadcrumbs from "./Breadcrumbs";
import { Helmet } from "react-helmet-async";

const Layout = ({ children }) => {
  return (
    <>
      <Helmet>
        <title>The Crumby Baker</title>
        <meta
          name="description"
          content="Baking recipes, tips and mediocrity."
        />

        <meta property="og:title" content="The Crumby Baker" />
        <meta
          property="og:description"
          content="Baking recipes, tips and mediocrity."
        />
        <meta
          property="og:image"
          content="https://www.thecrumbybaker.com/og-default.png"
        />
        <meta property="og:url" content="https://www.thecrumbybaker.com" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:site_name" content="The Crumby Baker" />
      </Helmet>

      <div className="min-h-screen flex flex-col ">
        <Navbar />
        {/* <Breadcrumbs /> */}
        <main className="flex-1 w-full ">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;

//
