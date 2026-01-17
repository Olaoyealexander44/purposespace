import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const redirectUrl = "http://localhost:5000/user/reset_password_page";

    axios.post("http://localhost:5000/user/requestpasswordreset", {
        email,
        redirectUrl
    })
    .then(response => {
        const { data } = response;
        if (data.status === "PENDING" || data.status === "SUCCESS") {
            setStatus("SUCCESS");
            setMessage(data.message);
        } else {
            setStatus("FAILED");
            setMessage(data.message);
        }
    })
    .catch(err => {
        console.error(err);
        setStatus("FAILED");
        setMessage("An error occurred while sending the reset link.");
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f9fc] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-center mb-3">
            <img
            src="/images/logo.png"
            alt="PurposeSpace Logo"
            className="w-16 h-16 object-contain"
            />
        </div>
        <h2 className="text-2xl font-semibold text-[#00bf63] text-center">
          Forgot Password?
        </h2>

        <p className="text-sm text-gray-600 text-center mt-2 mb-6">
          Enter your registered email address and we’ll send you a link to reset
          your password.
        </p>

        {message && (
            <div className={`mb-4 text-center text-sm font-medium ${status === "SUCCESS" ? "text-green-600" : "text-red-600"}`}>
                {message}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent"
            />
          </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#00bf63] text-white py-3 rounded-lg font-medium hover:bg-[#00994f] transition duration-300"
          >
            Send Reset Link
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            to="/signin"
            className="text-sm text-[#00bf63] hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
 