import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-5xl font-bold text-red-600 mb-4">Oops!</h1>
      <p className="text-lg text-gray-700 mb-6">Something went wrong.</p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-red-500 text-white rounded shadow hover:bg-red-600 transition-colors"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default ErrorPage;
