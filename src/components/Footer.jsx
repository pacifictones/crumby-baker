import React from "react";
import SocialIcons from "./SocialIcons";

const Footer = () => {
  return (
    <footer className="font-heading w-full  bg-[#E7D8C9] py-6 text-center mt-14">
      <p className="max-w-screen-lg mx-auto  p-2">
        © {new Date().getFullYear()} The Crumby Baker
      </p>

      <SocialIcons
        size="w-8 h-8"
        color="text-black"
        className="justify-center mt-4"
      />
    </footer>
  );
};

export default Footer;
