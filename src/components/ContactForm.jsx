import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  message: yup
    .string()
    .min(10, "Message should be at least 10 characters")
    .required("Message is required"),
});

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { executeRecaptcha } = useGoogleReCaptcha();

  const onSubmit = async (data) => {
    if (!executeRecaptcha) {
      console.error("Execute recaptcha not yet available");
      return;
    }

    // Execute reCAPTCHA v3 to get the token
    const token = await executeRecaptcha("contact_form"); // 'contact_form' is the action name

    try {
      const response = await fetch("/api/verifyCaptcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }), // Send the token to your serverless function
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Verification failed:", errorData.message);
        alert("CAPTCHA verification failed. Please try again.");
        return;
      }

      const result = await response.json();

      if (result.success) {
        console.log("CAPTCHA passed, handle form submission");
        // Handle successful form submission
      } else {
        alert("CAPTCHA verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during verification:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-screen-md mx-auto p-8  shadow-md rounded-lg bg-white"
    >
      <div className="mb-4">
        <label
          className="font-heading block text-gray-700 text-sm font-bold mb-2"
          htmlFor="name"
        >
          Name
        </label>
        <input
          {...register("name")}
          className="font-body bg-white shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          placeholder="Your name"
        />
        {errors.name && (
          <p className="text-red-500 text-xs italic">{errors.name.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="email"
          className="font-heading block text-gray-700 text-sm font-bold mb-2"
        >
          Email
        </label>
        <input
          {...register("email")}
          className="font-body shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          type="email"
          placeholder="Your email"
        />
        {errors.email && (
          <p className="text-red-500 text-xs italic">{errors.email.message}</p>
        )}
      </div>
      <div className="mb-6">
        <label
          htmlFor="message"
          className="font-heading block text-gray-700 text-sm font-bold mb-2"
        >
          Message
        </label>
        <textarea
          {...register("message")}
          className="font-body shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
          id="message"
          placeholder="Your message"
          rows="5"
        ></textarea>
        {errors.message && (
          <p className="text-red-500 text-xs italic">
            {errors.message.message}
          </p>
        )}
      </div>

      <div>
        <button className="btn-primary" type="submit">
          Send
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
