import React from "react";
import ContactForm from "../components/ContactForm";

const Contact = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-4">
        Contact the Crumby Baker
      </h1>
      <p className="text-lg text-gray-700 text-center">Hit me up!</p>
      <ContactForm />
    </div>
  );
};

export default Contact;
