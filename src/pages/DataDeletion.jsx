import { Link } from "react-router-dom";

const DataDeletion = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold font-heading mb-4">
        Data Deletion Policy
      </h1>
      <p className="font-body">Last updated: March 2025</p>
      <p className="font-body">
        If you wish to delete your data from The Crumby Baker, please{" "}
        <Link className="font-semibold hover:text-brand-primary" to="/contact">
          contact us
        </Link>
        with the subject {"Data Deletion Request."}
      </p>

      <p className="font-body">We will process your request within 7 days.</p>
    </div>
  );
};

export default DataDeletion;
