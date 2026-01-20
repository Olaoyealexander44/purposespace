import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { connect } from 'react-redux';
import Loader from './loader.jsx';
import { loginUser } from './../auth/actions/useractions';

function Signin({ loginUser }) {
  const navigate = useNavigate();
  const {userEmail} = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    email: userEmail || '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fieldError, setFieldError] = useState("");

  const images = [
    "images/signupimage.jpg",
    "images/signupimage2.jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFieldError("");

    // Validate form data
    if (!formData.email || !formData.password) {
      alert('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    loginUser(formData, navigate, setFieldError, setIsLoading);
  };




  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f9fc] p-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white shadow-lg rounded-2xl overflow-hidden">

        {/* Left Section: Image Slider */}
        <div className="relative flex-1 bg-[#eafaf1] overflow-hidden h-64 sm:h-80 md:h-auto">
          <div className="relative w-full h-full">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Inspiring Community ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? "opacity-100" : "opacity-0"
                  }`}
              />
            ))}
          </div>

          {/* Captions */}
          <div className="absolute bottom-20 left-3 sm:left-4 md:left-6 bg-white/95 text-[#00bf63] font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl shadow-lg px-4 py-3 rounded-xl animate-[fadeInUp_1s_ease-in-out] max-w-[85%] sm:max-w-[80%]">
            There is a space for you here.
          </div>
          <div className="absolute bottom-8 left-3 sm:left-4 md:left-6 bg-[#00bf63]/90 text-white font-semibold text-sm sm:text-base md:text-lg shadow-lg px-4 py-2 rounded-lg animate-[fadeInUp_1s_ease-in-out]">
            Be part of the purpose-driven community.
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-2 right-3 sm:right-4 flex space-x-2">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Right Section: Signin Form */}
        <div className="flex-1 bg-gradient-to-br from-[#eafaf1] to-white flex flex-col justify-center p-8 md:p-12">

          {/* Brand */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <img
                src="images/logo.png"
                alt="PurposeSpace Logo"
                className="w-16 h-16 object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-[#00bf63] mb-2">
              PurposeSpace
            </h1>
            <p className="text-gray-600">Welcome back to the community.</p>
          </div>

          {/* Signin Form */}
          <form onSubmit={handleSignIn} className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-5">
            <div className="flex flex-col">
              <label htmlFor="email" className="font-semibold mb-1 text-gray-800 text-left">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                className="p-3 border border-gray-300 rounded-lg outline-none focus:border-[#00bf63] focus:shadow-[0_0_6px_rgba(0,191,99,0.3)]"
              />
              {fieldError && <p className="text-red-500 text-sm mt-1">{fieldError}</p>}
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="font-semibold mb-1 text-gray-800 text-left">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                className="p-3 border border-gray-300 rounded-lg outline-none focus:border-[#00bf63] focus:shadow-[0_0_6px_rgba(0,191,99,0.3)]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#00bf63] text-white font-bold py-3 rounded-lg transition duration-300 hover:bg-[#00994f] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isLoading ? <Loader height="30" width="30" className="" /> : 'Sign In'}
            </button>

            <div className="text-center">
              <Link
                to="/forgottenpassword"
                className="text-sm text-[#00bf63] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </form>

          {/* Social Login */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Or continue with</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-md mx-auto">
              <button className="flex items-center justify-center gap-2 bg-[#3b5998] text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition text-sm sm:text-base">
                <i className="fab fa-facebook-f"></i> Facebook
              </button>
              <button className="flex items-center justify-center gap-2 bg-[#e1306c] text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition text-sm sm:text-base">
                <i className="fab fa-instagram"></i> Instagram
              </button>
              <button className="flex items-center justify-center gap-2 bg-[#1da1f2] text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition text-sm sm:text-base">
                <i className="fab fa-twitter"></i> Twitter
              </button>
            </div>
          </div>

          {/* Link to Signup */}
          <p className="text-gray-600 text-sm text-center mt-4">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#00bf63] font-bold hover:underline cursor-pointer bg-transparent border-none p-0"
            >
              Sign up
            </Link>
          </p>
          <div className="text-center mt-6">
            <Link
              to="/adminsignin"
              className="text-gray-500 text-sm hover:text-[#00bf63] hover:underline transition-colors"
            >
              Login as Admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect(null, { loginUser })(Signin);