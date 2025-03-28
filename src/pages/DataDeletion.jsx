import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const DataDeletion = () => {
  return (
    <>
      <Helmet>
        <title>Data Deletion Policy</title>
      </Helmet>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold font-heading mb-4">
          Data Deletion Policy
        </h1>
        <p className="font-body mb-4">Last updated: March 2025</p>
        <p className="font-body mb-4">
          If you wish to delete your data from The Crumby Baker, please{" "}
          <Link
            className="font-semibold hover:text-brand-primary"
            to="/contact"
          >
            contact us
          </Link>{" "}
          with the subject &quot;Data Deletion Request.&quot;
        </p>

        <p className="font-body">We will process your request within 7 days.</p>
      </div>
    </>
  );
};

export default DataDeletion;
