import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy</title>
      </Helmet>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold font-heading mb-4">Privacy Policy</h1>
        <p className="font-body">Last updated: March 2025</p>
        <p className="font-body">
          We respect your privacy. This Privacy Policy explains how we handle
          user information on our site.
        </p>

        <h2 className="text-2xl font-semibold font-heading mt-4">
          1. Information We Collect
        </h2>
        <p className="font-body">
          We do not collect personal information form users. The site may use
          cookies for functionality.
        </p>

        <h2 className="text-2xl font-semibold font-heading mt-4">
          2. Third-Party Services
        </h2>
        <p className="font-body">
          Our site may contain links to third-party services (e.g., Instagram,
          Facebook). We are not responsible for their privacy policies.
        </p>

        <h2 className="text-2xl font-semibold font-heading mt-4">
          3. Changes to This Policy
        </h2>
        <p className="font-body">
          We may update this policy from time to time. Check this page for the
          latest version.
        </p>

        <h2 className="text-2xl font-semibold font-heading mt-4">4. Contact</h2>
        <p className="font-body">
          If you have any questions,{" "}
          <Link
            className="font-semibold hover:text-brand-primary"
            to="/contact"
          >
            contact us.
          </Link>
        </p>
      </div>
    </>
  );
};

export default PrivacyPolicy;
