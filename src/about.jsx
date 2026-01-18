import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AboutUs() {
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const teamMembers = [
    { name: "Wole Soyinka", role: "C.E.O", color: "bg-gradient-to-r from-blue-500 to-purple-600" },
    { name: "Wole Soyinka", role: "Digital Marketer", color: "bg-gradient-to-r from-green-500 to-teal-600" },
    { name: "Wole Soyinka", role: "HR", color: "bg-gradient-to-r from-pink-500 to-rose-600" },
    { name: "Wole Soyinka", role: "UI/UX Designer", color: "bg-gradient-to-r from-orange-500 to-red-600" },
    { name: "Wole Soyinka", role: "Software Engineer", color: "bg-gradient-to-r from-indigo-500 to-blue-600" },
    { name: "Wole Soyinka", role: "Ass. General Sec", color: "bg-gradient-to-r from-yellow-500 to-orange-600" },
  ];

  const handleBackClick = () => {
    navigate('/');
  };

  const handleGetStartedClick = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 w-full h-[60px] bg-gradient-to-r from-[#4DAA57] to-[#3d8b47] backdrop-blur-md bg-opacity-95 flex items-center justify-between px-4 md:px-6 text-white z-50 shadow-lg"
      >
        <motion.button 
          onClick={handleBackClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </motion.button>
        <h1 className="text-lg md:text-xl font-bold tracking-wide">
          About Us
        </h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </motion.header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-28 md:pb-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            {...fadeInUp}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Welcome to <span className="text-[#4DAA57]">Purposespace</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Purpose is the place where your deep gladness meets the world’s deep need.
            </p>
          </motion.div>

          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex justify-center mb-16"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#4DAA57] to-[#FFC73C] rounded-3xl blur-2xl opacity-20 scale-110"></div>
              <img
                src="images/aboutus-icon.jpg"
                alt="About Us"
                className="relative w-full max-w-[700px] h-auto rounded-3xl shadow-3xl border-8 border-white/30"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            {...fadeInUp}
            className="text-2xl md:text-4xl font-bold text-center text-gray-800 mb-10 md:mb-16"
          >
            Our Purpose
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-12">
            {/* Mission Card */}
            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.1 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#4DAA57] to-[#3d8b47] p-6 md:p-8 text-white shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-4 md:mb-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold">Our Mission</h3>
                  </div>
                  <p className="text-base md:text-lg leading-relaxed opacity-95">
                    To simplify renting in Nigeria through transparency, cost savings, and community-driven trust. We're committed to making every rental experience seamless, secure, and satisfying for both tenants and landlords.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Vision Card */}
            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.2 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#FFC73C] to-[#f0b429] p-6 md:p-8 text-gray-800 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-20 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-20 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-4 md:mb-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white bg-opacity-30 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold">Our Vision</h3>
                  </div>
                  <p className="text-base md:text-lg leading-relaxed">
                    To make renting stress-free for every Nigerian by building trust and access into every step. We envision a future where finding and securing rental properties is as easy as a few clicks.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            {...fadeInUp}
            className="text-center mb-10 md:mb-16"
          >
            <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
              Meet Our Amazing Team
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind Purposespace, working tirelessly to transform your rental experience.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="flex flex-col gap-6 md:gap-10 max-w-5xl mx-auto"
          >
            {teamMembers.map((member, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="group cursor-pointer"
              >
                <div className="relative bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 border border-gray-100">
                  {/* Decorative Background Element */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#4DAA57]/5 to-[#FFC73C]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                  
                  <div className="flex flex-col md:flex-row items-center p-6 md:p-10 gap-6 md:gap-10 relative z-10">
                    {/* Image Side - Left */}
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#4DAA57] to-[#FFC73C] rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 scale-110"></div>
                      <div className="relative p-1.5 bg-gradient-to-br from-[#4DAA57] to-[#FFC73C] rounded-full">
                        <img
                          src="images/teampic.png"
                          alt={member.name}
                          className="w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 rounded-full object-cover border-4 border-white shadow-2xl group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>

                    {/* Content Side - Right */}
                    <div className="flex-1 text-center md:text-left space-y-3 md:space-y-5">
                      <div>
                        <h3 className="text-2xl md:text-4xl font-extrabold text-gray-800 mb-2 group-hover:text-[#4DAA57] transition-colors duration-300">
                          {member.name}
                        </h3>
                        <div className="h-1 w-16 md:w-20 bg-gradient-to-r from-[#4DAA57] to-[#FFC73C] rounded-full mx-auto md:mx-0 opacity-80"></div>
                      </div>
                      
                      <div className="flex justify-center md:justify-start">
                        <span className={`px-4 py-2 md:px-6 md:py-2.5 rounded-full text-white text-sm md:text-lg font-semibold tracking-wide ${member.color} shadow-lg shadow-gray-200/50 transform hover:scale-105 transition-transform duration-300`}>
                          {member.role}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-base md:text-lg italic leading-relaxed max-w-xl">
                        "Dedicated to excellence and driving innovation at Purposespace. Committed to transforming the rental landscape with integrity."
                      </p>
                      
                      {/* Social Icons */}
                      <div className="flex justify-center md:justify-start gap-4 pt-2 md:pt-4">
                        <motion.div whileHover={{ y: -3 }} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#4DAA57] hover:text-white hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200">
                           <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                        </motion.div>
                        <motion.div whileHover={{ y: -3 }} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#0077b5] hover:text-white hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200">
                          <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom Decorative Bar */}
                  <div className="h-2 w-full bg-gradient-to-r from-[#4DAA57] via-[#FFC73C] to-[#4DAA57] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 px-4 md:py-16 md:px-6 bg-gradient-to-r from-[#4DAA57] to-[#3d8b47] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Rental Experience?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Join thousands of satisfied users who trust Purposespace for their rental needs.
            </p>
            <motion.button 
              onClick={handleGetStartedClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[#4DAA57] px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Get Started Today
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
