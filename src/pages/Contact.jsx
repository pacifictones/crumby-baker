import React from "react";
import ContactForm from "../components/ContactForm";
import { Helmet } from "react-helmet";

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact</title>
      </Helmet>
      <div className="my-10 pb-12 pt-8">
        <h1 className="font-heading text-3xl font-bold text-center mb-4">
          Contact the Crumby Baker
        </h1>
        {/* <p className="text-lg text-gray-700 text-center">Hit me up!</p> */}
        <ContactForm />
      </div>
    </>
  );
};

export default Contact;
