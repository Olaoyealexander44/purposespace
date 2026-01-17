import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { userEmail } = useParams();
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const isAdmin = queryParams.get("role") === "admin";

  const handleProceed = () => {
    if (isAdmin) {
      navigate(`/adminsignin/${userEmail}`);
    } else {
      navigate(`/signin/${userEmail}`);
    }
  };

  const handleResend = () => {
    alert("Verification email resent!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-500 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 text-center">
        
        <div className="text-5xl mb-4">📧</div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Verify your email
        </h1>

        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          We’ve sent a verification link to your email address.
          Please click the link to activate your account.
        </p>

        <button
          onClick={handleProceed}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition duration-200"
        >
            Proceed
        </button>

        <p className="mt-5 text-sm text-gray-500">
          Didn’t receive the email?
          <button
            onClick={handleResend}
            className="ml-1 text-indigo-600 font-semibold hover:underline"
          >
            Resend
          </button>
        </p>

      </div>
    </div>
  );
};

export default VerifyEmail;

