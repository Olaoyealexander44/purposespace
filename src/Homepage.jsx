import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PopupMedia from "./popup.jsx";

// Import blog data from blogpage.jsx
const initialBlogs = [
  {
    author: "John Doe",
    time: "2 hours ago",
    text: "🚀 Unlock Your Peak Productivity: Master the Art of Deep Focus\n\nTransform your daily routine with scientifically-backed strategies that top performers swear by. From the revolutionary time-blocking method to creating distraction-free environments, discover how to reclaim your most productive hours. Join thousands who've already doubled their output while working fewer hours.",
    img: "/images/vision.jpeg",
    url: "#",
  },
  {
    author: "Jane Smith",
    time: "Yesterday",
    text: "🌱 Superfoods Revolution: Fuel Your Body for Extraordinary Health\n\nUncover the secret weapons of nutrition that can dramatically transform your energy, immunity, and longevity. These powerhouse foods aren't just trendy – they're scientifically proven to optimize your body's natural healing processes. Ready to feel 10 years younger?",
    img: "/images/vision.jpeg",
    url: "#",
  },
];

const moreBlogs = [
  {
    author: "Mike Johnson",
    time: "3 days ago",
    text: "✈️ Europe on a Budget: Insider Secrets from a Seasoned Traveler\n\nDiscover the underground travel hacks that locals don't want tourists to know. From scoring €20 flights to finding authentic restaurants away from tourist traps, these battle-tested strategies will save you thousands. Your European adventure just got 10x more affordable and authentic.",
    img: "/images/vision.jpeg",
    url: "#",
  },
  {
    author: "Sarah Lee",
    time: "1 week ago",
    text: "💪 Home Fitness Revolution: Build Your Dream Body Without a Gym\n\nNo equipment? No problem! Transform your living room into a personal fitness studio with these game-changing bodyweight exercises. From busy parents to remote workers, discover how 15 minutes a day can sculpt the physique you've always wanted. Your excuses just ran out of room.",
    img: "/images/vision.jpeg",
    url: "#",
  },
];

// Function to transform blog data from blogpage format to homepage format
const transformBlogData = (blogData) => {
  return blogData.map((blog, index) => {
    // Extract title from the first line (before first \n)
    const lines = blog.text.split('\n');
    const title = lines[0].replace(/[🚀🌱✈️💪]/g, '').trim(); // Remove emojis and trim

    // Extract description from the second paragraph (after first \n\n)
    const paragraphs = blog.text.split('\n\n');
    const description = paragraphs[1] || paragraphs[0].substring(0, 150) + '...';

    // Calculate read time based on text length (average 200 words per minute)
    const wordCount = blog.text.split(' ').length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200)) + ' min read';

    return {
      id: index + 1,
      image: blog.img,
      title: title,
      description: description,
      readTime: readTime,
      author: blog.author,
      time: blog.time
    };
  });
};

export default function PurposeSpace() {
  const navigate = useNavigate();
  const visionRef = useRef(null);
  const missionRef = useRef(null);

  const [visionMissionSlide, setVisionMissionSlide] = useState(0);
  const [successStorySlide, setSuccessStorySlide] = useState(0);
  const [currentExcellenceIndex, setCurrentExcellenceIndex] = useState(0);
  const [currentBlogIndex, setCurrentBlogIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Authentication state - check if user is signed in
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showSignOut, setShowSignOut] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      // Check localStorage for authentication token or user data
      const authToken = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');

      if (authToken || userData) {
        setIsSignedIn(true);

        // Parse user data to get user information
        try {
          const userInfo = userData ? JSON.parse(userData) : null;
          if (userInfo && userInfo.name) {
            // Extract first name from full name
            const firstName = userInfo.name.split(' ')[0];
            setCurrentUser({
              firstName: firstName,
              fullName: userInfo.name,
              email: userInfo.email,
              avatar: userInfo.avatar || null // Will use default avatar if none provided
            });
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          // Clear invalid data
          localStorage.removeItem('userData');
          setIsSignedIn(false);
          setCurrentUser(null);
        }
      } else {
        setIsSignedIn(false);
        setCurrentUser(null);
      }
    };

    checkAuthStatus();

    // Listen for storage changes (when user signs in/out in another tab)
    window.addEventListener('storage', checkAuthStatus);

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  // Get the latest 3 blog posts from blogpage.jsx data
  const allBlogData = [...initialBlogs, ...moreBlogs.slice(0, 1)]; // Take 2 from initial + 1 from more = 3 total
  const blogPosts = transformBlogData(allBlogData);

  const spotlightStories = [
    {
      type: 'picture',
      media: 'images/precious.jpeg',
      title: 'Community Transformation',
      caption: 'Meet Sarah, who transformed her entire neighborhood through community gardening initiatives. Her story shows how one person\'s vision can create lasting change and bring people together.',
      readTime: '4 min read'
    },
    {
      type: 'video',
      media: 'images/precious.jpeg', // Temporarily using image until video files are added
      poster: 'images/precious.jpeg',
      title: 'From Struggle to Success',
      caption: 'Watch John\'s incredible journey from unemployment to becoming a successful entrepreneur. His determination and the support from our community programs made all the difference.',
      readTime: '6 min watch'
    },
    {
      type: 'picture',
      media: 'images/precious.jpeg',
      title: 'Educational Impact',
      caption: 'Discover how our scholarship program helped Maria become the first in her family to graduate from university. Her achievement is now inspiring others in her community to pursue higher education.',
      readTime: '5 min read'
    },
    {
      type: 'video',
      media: 'images/vision2.jpg', // Temporarily using image until video files are added
      poster: 'images/precious.jpeg',
      title: 'Innovation in Action',
      caption: 'Experience the innovative solutions our tech incubator participants are creating. These young minds are solving real-world problems and making technology accessible to everyone.',
      readTime: '8 min watch'
    }
  ];

  const successStories = [
    {
      id: 1,
      image: "images/precious.jpeg",
      name: "Dr. Amina Hassan",
      title: "Medical Doctor & Community Health Advocate",
      location: "Lagos, Nigeria",
      story: "When I first joined Purpose Space's mentorship program three years ago, I was a struggling medical student with big dreams but limited resources. Growing up in a small village outside Lagos, becoming a doctor seemed impossible. My family couldn't afford the fees, and I was working multiple part-time jobs just to survive. The turning point came when I was matched with Dr. Kemi Adebayo through Purpose Space's professional mentorship network. She didn't just provide guidance; she opened doors I never knew existed. Through her connections, I secured a scholarship that covered my final two years of medical school. But more importantly, she taught me that success isn't just about personal achievement—it's about lifting others as you climb. Today, I'm not only a practicing physician at Lagos University Teaching Hospital, but I've also established a mobile health clinic that serves rural communities across three states. We've provided free medical care to over 5,000 people and trained 200 community health workers. I'm now a mentor myself in the Purpose Space program, paying forward the incredible support I received.",
      mobileStory: "From struggling medical student to practicing physician, Purpose Space's mentorship program transformed my life. Today, I run a mobile health clinic serving rural communities and have trained 200+ health workers while mentoring others through the same program that helped me succeed.",
      impact: "5,000+ lives touched • 200+ health workers trained"
    },
    {
      id: 2,
      image: "images/precious.jpeg",
      name: "Emmanuel Okafor",
      title: "Tech Entrepreneur & Software Developer",
      location: "Abuja, Nigeria",
      story: "Five years ago, I was a university dropout with no clear direction in life. I had always been passionate about technology, but coming from a low-income family, I couldn't afford proper training or equipment. That's when I discovered Purpose Space's tech incubator program. They provided me with a laptop, internet access, and most importantly, mentorship from industry professionals. The program taught me not just coding skills, but also business fundamentals, project management, and leadership. Within two years, I had developed my first mobile app for local farmers to connect directly with buyers, eliminating middlemen and increasing their profits. Today, my startup 'FarmConnect' has over 10,000 active users across West Africa and has helped farmers increase their income by an average of 40%. We've also created 50 direct jobs and countless indirect opportunities. I'm now an investor and mentor in the same program that transformed my life, helping other young people turn their ideas into reality.",
      mobileStory: "University dropout turned tech entrepreneur through Purpose Space's incubator program. My app 'FarmConnect' now serves 10,000+ users across West Africa, helping farmers increase income by 40% while creating 50+ jobs.",
      impact: "10,000+ app users • 40% farmer income increase • 50+ jobs created"
    },
    {
      id: 3,
      image: "images/precious.jpeg",
      name: "Fatima Al-Rashid",
      title: "Educational Reformer & School Principal",
      location: "Kano, Nigeria",
      story: "Growing up in northern Nigeria, I witnessed firsthand how limited educational opportunities, especially for girls, perpetuated cycles of poverty. Despite facing cultural barriers and financial constraints, I was determined to pursue higher education. Purpose Space's scholarship program made this dream possible, covering my university fees and providing ongoing mentorship. After graduating with a degree in Education, I returned to my community with a mission to transform the local education system. I started by establishing a girls' school that now serves over 800 students from kindergarten through secondary level. Our innovative curriculum combines traditional subjects with practical skills like computer literacy, entrepreneurship, and leadership development. We've achieved a 95% graduation rate and 80% of our graduates go on to higher education or start their own businesses. The ripple effect has been incredible - families that once saw no value in educating girls are now sending their daughters to school. I've also trained over 100 teachers across the region in modern teaching methods and gender-inclusive education practices.",
      mobileStory: "Purpose Space's scholarship enabled my education journey. I established a girls' school serving 800+ students with 95% graduation rate and trained 100+ teachers, transforming educational opportunities in northern Nigeria.",
      impact: "800+ students educated • 95% graduation rate • 100+ teachers trained"
    }
  ];

  const menOfExcellence = [
    {
      id: 1,
      image: "images/teampic.png",
      name: "Dr. Kwame Asante",
      title: "Neurosurgeon & Medical Innovator",
      location: "Accra, Ghana",
      achievement: "Pioneered groundbreaking brain surgery techniques that have saved over 2,000 lives across Africa. Established the first neurosurgery training center in West Africa, training 150+ surgeons.",
      impact: "2,000+ lives saved • 150+ surgeons trained • 5 medical patents"
    },
    {
      id: 2,
      image: "images/vision.jpeg",
      name: "Prof. Chidi Okonkwo",
      title: "Renewable Energy Engineer & Entrepreneur",
      location: "Port Harcourt, Nigeria",
      achievement: "Developed solar energy solutions that have brought electricity to over 500 rural communities. His innovations have reduced carbon emissions by 40% in participating regions.",
      impact: "500+ communities electrified • 40% carbon reduction • 1,000+ jobs created"
    },
    {
      id: 3,
      image: "images/vision2.jpg",
      name: "Dr. Abdullahi Musa",
      title: "Agricultural Scientist & Food Security Expert",
      location: "Kaduna, Nigeria",
      achievement: "Developed drought-resistant crop varieties that have increased food production by 60% in arid regions. His research has helped feed over 1 million people across the Sahel.",
      impact: "1M+ people fed • 60% yield increase • 20+ crop varieties developed"
    }
  ];

  // Intersection Observer for Vision & Mission animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0", "translate-x-0");
          }
        });
      },
      { threshold: 0.3 }
    );

    if (visionRef.current) observer.observe(visionRef.current);
    if (missionRef.current) observer.observe(missionRef.current);

    return () => {
      if (visionRef.current) observer.unobserve(visionRef.current);
      if (missionRef.current) observer.unobserve(missionRef.current);
    };
  }, []);

  // Blog posts don't need auto-slideshow anymore

  // Vision & Mission Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setVisionMissionSlide((prev) => (prev + 1) % 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Men of Excellence Auto-slide (mobile only)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExcellenceIndex((prev) => (prev + 1) % menOfExcellence.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Blog Posts Auto-slide (mobile only)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBlogIndex((prev) => (prev + 1) % blogPosts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle popup opening
  const openPopup = (story, type = "image") => {
    setPopupData({
      type: type,
      title: story.title || story.name,
      meta: story.readTime || `${story.title} • ${story.location || 'Success Story'}`,
      description: story.caption || story.story,
      imageUrl: story.media || story.image,
      videoUrl: story.type === 'video' ? story.media : undefined
    });
    setShowPopup(true);
  };

  // Handle popup closing
  const closePopup = () => {
    setShowPopup(false);
    setPopupData(null);
  };

  // Navigation functions
  const handleSignInClick = () => {
    navigate('/signin');
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  // Authentication helper functions
  const requireAuth = (callback, showAlert = true) => {
    if (isSignedIn) {
      callback();
    } else {
      if (showAlert) {
        alert('Please sign in to access this content.');
      }
      navigate('/signin');
    }
  };

  const handleProtectedBlogAccess = () => {
    requireAuth(() => navigate('/blogpage'));
  };

  const handleProtectedPopup = (item, type) => {
    requireAuth(() => openPopup(item, type));
  };

  const handleSignOut = () => {
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userInfo');
    setIsSignedIn(false);
    setCurrentUser(null);

    // Trigger storage event for other tabs/components
    window.dispatchEvent(new Event('storage'));

    alert('Successfully signed out!');
  };



  return (
    <div className="font-roboto bg-gray-50 text-gray-800 scroll-smooth w-full">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-green-800 via-green-700 to-green-800 text-white shadow-2xl backdrop-blur-sm">
        <div className="flex justify-between items-center px-4 py-3 sm:px-6 sm:py-4 max-w-7xl mx-auto">
          {/* Logo Section */}
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src="images\logo.png"
                alt="Purpose Space Logo"
                className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-contain filter brightness-110 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Purpose Space</h1>
              <p className="text-xs text-green-100">Empowering Excellence</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {["Home", "About", "Blog", "Spotlights", "Career", "Contact"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="relative font-semibold text-white hover:text-green-100 transition-all duration-300 group py-2"
              >
                {link}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {isSignedIn ? (
              <>
                {/* Beautiful Welcome Section with Avatar - Clickable */}
                <div
                  onClick={() => setShowSignOut(!showSignOut)}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer select-none"
                >
                  {/* User Avatar */}
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-white/30">
                      {currentUser?.avatar ? (
                        <img
                          src={currentUser.avatar}
                          alt={`${currentUser.firstName}'s avatar`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold">
                          {currentUser?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    {/* Online Status Indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                  </div>

                  {/* Welcome Text */}
                  <div className="flex flex-col">
                    <span className="text-white font-semibold text-sm leading-tight">
                      Welcome back,
                    </span>
                    <span className="text-green-200 font-bold text-base leading-tight">
                      {currentUser?.firstName || 'User'}!
                    </span>
                  </div>

                  {/* Dropdown Arrow */}
                  <div className={`ml-1 transition-transform duration-200 ${showSignOut ? 'rotate-180' : ''}`}>
                    <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Sign Out Button - Conditionally Rendered */}
                {showSignOut && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSignOut();
                      setShowSignOut(false);
                    }}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold px-5 py-2.5 rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105 animate-fadeIn"
                  >
                    Sign Out
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={handleSignInClick}
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold px-5 py-2.5 rounded-full hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  SignIn
                </button>
                <button
                  onClick={handleSignUpClick}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold px-5 py-2.5 rounded-full hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  SignUp
                </button>
              </>
            )}
          </div>

          {/* Enhanced Mobile Hamburger Menu Button */}
          <button
            className="lg:hidden relative flex flex-col justify-center items-center w-10 h-10 rounded-lg bg-green-900/50 hover:bg-green-800/50 transition-all duration-300 group"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : 'translate-y-0'}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ease-in-out mt-1.5 ${isMobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ease-in-out mt-1.5 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-0'}`}></span>
          </button>
        </div>

        {/* Compact Mobile Menu Dropdown */}
        <div className={`lg:hidden absolute top-full left-0 right-0 z-40 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
          <div className="mx-4 mt-2 bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
            {/* Navigation Links */}
            <nav className="p-3">
              <div className="space-y-1">
                {["Home", "About", "Blog", "Spotlights", "Career", "Contact"].map((link) => (
                  <a
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    className="block px-4 py-3 text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-green-500/20 hover:to-emerald-500/20 rounded-xl transition-all duration-200 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </nav>

            {/* Compact Action Buttons */}
            <div className="px-3 pb-3 border-t border-gray-700/30 pt-3">
              {isSignedIn ? (
                <div className="space-y-3">
                  {/* Mobile Welcome Section with Avatar - Clickable */}
                  <div
                    onClick={() => setShowSignOut(!showSignOut)}
                    className="flex items-center gap-3 bg-gray-800/50 rounded-xl px-3 py-3 border border-gray-600/30 cursor-pointer hover:bg-gray-800/70 transition-all duration-200 select-none"
                  >
                    {/* User Avatar */}
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-gray-600/50">
                        {currentUser?.avatar ? (
                          <img
                            src={currentUser.avatar}
                            alt={`${currentUser.firstName}'s avatar`}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-semibold">
                            {currentUser?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        )}
                      </div>
                      {/* Online Status Indicator */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-gray-800 shadow-sm"></div>
                    </div>

                    {/* Welcome Text */}
                    <div className="flex flex-col flex-1">
                      <span className="text-gray-300 font-medium text-xs leading-tight">
                        Welcome back,
                      </span>
                      <span className="text-green-300 font-bold text-sm leading-tight">
                        {currentUser?.firstName || 'User'}!
                      </span>
                    </div>

                    {/* Dropdown Arrow */}
                    <div className={`transition-transform duration-200 ${showSignOut ? 'rotate-180' : ''}`}>
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Sign Out Button - Conditionally Rendered */}
                  {showSignOut && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                        setShowSignOut(false);
                      }}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-2.5 px-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 text-sm animate-fadeIn"
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      handleSignInClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-semibold py-2.5 px-3 rounded-xl hover:from-yellow-500 hover:to-orange-500 transition-all duration-200 text-sm"
                  >
                    SignIn
                  </button>
                  <button
                    onClick={() => {
                      handleSignUpClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold py-2.5 px-3 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-200 text-sm"
                  >
                    SignUp
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/10 backdrop-blur-[1px] z-30"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="relative flex flex-col items-center justify-center text-center min-h-[40vh] sm:min-h-[80vh] lg:min-h-screen bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1588776814546-ec69a8b81970?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/60 via-yellow-300/40 to-purple-500/40 z-0"></div>
        <div className="relative z-10 flex flex-col items-center justify-center gap-3 sm:gap-4 md:gap-6 px-4 py-8 w-full max-w-4xl mx-auto">
          <div className="relative">
            <img
              src="\images\logo.png"
              alt=""
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain relative z-10"
              style={{
                animation: 'logoGlow 2s ease-in-out infinite alternate',
                filter: 'drop-shadow(0 0 15px #22c55e) drop-shadow(0 0 30px #22c55e)'
              }}
            />
            <div
              className="absolute inset-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full opacity-75"
              style={{
                background: 'radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, rgba(34, 197, 94, 0.2) 50%, transparent 70%)',
                animation: 'pulse 2s ease-in-out infinite alternate'
              }}
            ></div>
          </div>
          <div className="text-center space-y-2 sm:space-y-3">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-yellow-300 drop-shadow-lg leading-tight px-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,0,0.5)' }}>
              Welcome to Purpose Space
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-green-200 drop-shadow-lg leading-relaxed max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto px-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 15px rgba(34,197,94,0.5)' }}>
              Empowering nurses with knowledge, opportunities, and growth.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-20 sm:w-40 h-20 sm:h-40 bg-green-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-24 sm:w-48 h-24 sm:h-48 bg-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-16 sm:w-32 h-16 sm:h-32 bg-teal-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4 sm:mb-6">
              Why Choose Purpose Space?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed">
              Discover the powerful features that make Purpose Space the ultimate platform for nursing professionals to grow, connect, and excel in their careers.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-green-100/50">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl sm:text-2xl">📚</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 group-hover:text-green-600 transition-colors">
                  Knowledge Sharing
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Access a vast library of nursing resources, research papers, and best practices shared by healthcare professionals worldwide.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-emerald-100/50">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl sm:text-2xl">🤝</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 group-hover:text-emerald-600 transition-colors">
                  Professional Networking
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Connect with fellow nurses, mentors, and healthcare leaders to build meaningful professional relationships and career opportunities.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-teal-100/50">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-green-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-400 to-green-500 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl sm:text-2xl">🎯</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 group-hover:text-teal-600 transition-colors">
                  Career Development
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Get personalized coaching, skill assessments, and career guidance to advance your nursing career and achieve your professional goals.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-purple-100/50">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl sm:text-2xl">🏆</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 group-hover:text-purple-600 transition-colors">
                  Success Stories
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Be inspired by real success stories from nurses who have transformed their careers and made significant impacts in healthcare.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-100/50">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl sm:text-2xl">💡</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 group-hover:text-blue-600 transition-colors">
                  Innovation Hub
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Explore cutting-edge healthcare technologies, research opportunities, and innovative solutions that are shaping the future of nursing.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-orange-100/50">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl sm:text-2xl">🌍</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 group-hover:text-orange-600 transition-colors">
                  Global Community
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Join a diverse, global community of healthcare professionals committed to making a positive impact in healthcare across Africa and beyond.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Slider */}
      <section id="vision-mission" className="py-12 sm:py-16 lg:py-24 relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-16 sm:w-32 h-16 sm:h-32 bg-green-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-20 sm:w-40 h-20 sm:h-40 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 sm:w-64 h-32 sm:h-64 bg-purple-300 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4">
              Our Foundation
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-xs sm:max-w-lg lg:max-w-2xl mx-auto">
              Discover the vision that drives us and the mission that guides our every action
            </p>
          </div>

          {/* Slider Container */}
          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-2xl bg-white/80 backdrop-blur-sm border border-white/20">
              <div
                className="flex transition-transform duration-1000 ease-in-out"
                style={{ transform: `translateX(-${visionMissionSlide * 100}%)` }}
              >
                {/* Vision Slide */}
                <div className="w-full flex-shrink-0 relative">
                  <div className="relative p-6 sm:p-8 md:p-12 lg:p-16 min-h-[400px] sm:min-h-[500px] flex flex-col justify-center overflow-hidden">
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: 'url(images/vision.jpeg)' }}
                    ></div>

                    {/* Overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-900/70 via-emerald-800/60 to-green-700/80"></div>

                    {/* Decorative Elements */}
                    <div className="absolute top-3 sm:top-6 right-3 sm:right-6 w-12 sm:w-24 h-12 sm:h-24 bg-green-200/20 rounded-full blur-xl"></div>
                    <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 w-16 sm:w-32 h-16 sm:h-32 bg-emerald-200/15 rounded-full blur-2xl"></div>

                    <div className="relative z-10 text-center max-w-4xl mx-auto">
                      <div className="inline-flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 sm:mb-8 shadow-lg animate-bounce">
                        <span className="text-2xl sm:text-3xl">🌟</span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 relative drop-shadow-lg">
                        Our Vision
                        <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-green-400 via-yellow-400 to-emerald-500 rounded-full"></div>
                      </h2>

                      <div className="space-y-4 sm:space-y-6 text-white/95">
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed font-medium">
                          Purpose Space is a platform for people to share inspiring stories, celebrate achievements, and access opportunities. We believe in building stronger communities through collaboration and innovation.
                        </p>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
                          Our ultimate goal is to build Africa by releasing the greatness in its visionaries. Through transformational coaching, we empower individuals and institutions to create positive change and transform our continent for good.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mission Slide */}
                <div className="w-full flex-shrink-0 relative">
                  <div className="relative p-6 sm:p-8 md:p-12 lg:p-16 min-h-[400px] sm:min-h-[500px] flex flex-col justify-center overflow-hidden">
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: 'url(images/vision2.jpeg)' }}
                    ></div>

                    {/* Overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/75 via-indigo-800/65 to-blue-700/85"></div>

                    {/* Decorative Elements */}
                    <div className="absolute top-3 sm:top-6 left-3 sm:left-6 w-14 sm:w-28 h-14 sm:h-28 bg-blue-200/20 rounded-full blur-xl"></div>
                    <div className="absolute bottom-3 sm:bottom-6 right-3 sm:right-6 w-18 sm:w-36 h-18 sm:h-36 bg-indigo-200/15 rounded-full blur-2xl"></div>

                    <div className="relative z-10 text-center max-w-4xl mx-auto">
                      <div className="inline-flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-6 sm:mb-8 shadow-lg animate-bounce">
                        <span className="text-2xl sm:text-3xl">🚀</span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 relative drop-shadow-lg">
                        Our Mission
                        <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-500 rounded-full"></div>
                      </h2>

                      <div className="space-y-4 sm:space-y-6 text-white/95">
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed font-medium">
                          Our mission is to empower nurses and aspiring leaders with knowledge, opportunities, and actionable strategies. We provide transformational coaching, mentorship, and resources that enable individuals to thrive and make a positive impact in their communities.
                        </p>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
                          Through collaboration, innovation, and inspiration, we aim to create a network of professionals committed to growth, excellence, and meaningful change.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => setVisionMissionSlide(visionMissionSlide === 0 ? 1 : 0)}
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
            >
              <svg className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600 group-hover:text-gray-800 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => setVisionMissionSlide(visionMissionSlide === 0 ? 1 : 0)}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
            >
              <svg className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600 group-hover:text-gray-800 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Enhanced Slide Indicators */}
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={() => setVisionMissionSlide(0)}
              className={`group flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${visionMissionSlide === 0
                ? 'bg-green-500 text-white shadow-lg scale-105'
                : 'bg-white/70 text-gray-600 hover:bg-white hover:shadow-md'
                }`}
            >
              <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${visionMissionSlide === 0 ? 'bg-white' : 'bg-green-400'
                }`} />
              <span className="text-sm font-medium">Vision</span>
            </button>

            <button
              onClick={() => setVisionMissionSlide(1)}
              className={`group flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${visionMissionSlide === 1
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-white/70 text-gray-600 hover:bg-white hover:shadow-md'
                }`}
            >
              <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${visionMissionSlide === 1 ? 'bg-white' : 'bg-blue-400'
                }`} />
              <span className="text-sm font-medium">Mission</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="w-full bg-gray-200/50 rounded-full h-1 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-5000 ease-linear ${visionMissionSlide === 0 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-blue-400 to-indigo-500'
                  }`}
                style={{
                  width: '100%',
                  animation: 'progressBar 5s linear infinite'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blog Cards */}
      <section id="blog" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Latest Blog Posts
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-xs sm:max-w-lg lg:max-w-2xl mx-auto">
              Discover our latest insights, stories, and expert advice to help you grow and succeed
            </p>
          </div>

          {/* Mobile Carousel */}
          <div className="sm:hidden relative">
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentBlogIndex * 100}%)` }}
              >
                {blogPosts.map((post) => (
                  <div
                    key={post.id}
                    className="w-full flex-shrink-0 px-2"
                  >
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mx-auto max-w-sm">
                      {/* Card Image */}
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover object-center"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="hidden w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 items-center justify-center flex-col">
                          <div className="text-3xl mb-2">📝</div>
                          <p className="text-gray-600 font-medium text-xs">Blog Image</p>
                        </div>

                        {/* Read Time Badge */}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                          {post.readTime}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                          {post.title}
                        </h3>

                        <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-3">
                          {post.description}
                        </p>

                        {/* Read More Button */}
                        <button
                          onClick={handleProtectedBlogAccess}
                          className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                        >
                          {!isSignedIn && (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          )}
                          <span>Read More</span>
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {blogPosts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBlogIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentBlogIndex
                    ? 'bg-blue-500 w-6'
                    : 'bg-blue-200 hover:bg-blue-300'
                    }`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => setCurrentBlogIndex(prev =>
                prev === 0 ? blogPosts.length - 1 : prev - 1
              )}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
            >
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentBlogIndex(prev =>
                prev === blogPosts.length - 1 ? 0 : prev + 1
              )}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
            >
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Desktop Grid (hidden on mobile) */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden group"
              >
                {/* Card Image */}
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 items-center justify-center flex-col">
                    <div className="text-3xl sm:text-4xl mb-2">📝</div>
                    <p className="text-gray-600 font-medium text-xs sm:text-sm">Blog Image</p>
                  </div>

                  {/* Read Time Badge */}
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-gray-700">
                    {post.readTime}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {post.title}
                  </h3>

                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3 sm:mb-4 line-clamp-3">
                    {post.description}
                  </p>

                  {/* Read More Button */}
                  <button
                    onClick={handleProtectedBlogAccess}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                  >
                    {!isSignedIn && (
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                    <span>Read More</span>
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-8 sm:mt-12">
            <button
              onClick={handleProtectedBlogAccess}
              className="bg-white hover:bg-gray-50 text-gray-800 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 inline-flex items-center space-x-2"
            >
              {!isSignedIn && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
              <span>View All Blog Posts</span>
            </button>
          </div>
        </div>
      </section>

      {/* Spotlights */}
      <section id="spotlights" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-500 text-center mb-6 sm:mb-8">Life changing stories</h2>

          {/* Scrollable Cards with Arrows */}
          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={() => document.getElementById('spotlight-container').scrollBy({ left: -250, behavior: 'smooth' })}
              className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 shadow-lg transition-all duration-300 hover:scale-110"
            >
              <svg className="w-4 h-4 sm:w-6 sm:h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => document.getElementById('spotlight-container').scrollBy({ left: 250, behavior: 'smooth' })}
              className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 shadow-lg transition-all duration-300 hover:scale-110"
            >
              <svg className="w-4 h-4 sm:w-6 sm:h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Scrollable Container */}
            <div
              id="spotlight-container"
              className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide px-6 sm:px-8 py-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {spotlightStories.map((story, idx) => (
                <div key={idx} className="relative bg-white rounded-xl overflow-hidden h-[350px] sm:h-[400px] w-[250px] sm:w-[300px] flex-shrink-0 flex flex-col justify-end text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  {/* Media Content */}
                  {story.type === 'video' ? (
                    <video
                      className="absolute top-0 left-0 w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      poster={story.poster}
                    >
                      <source src={story.media} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={story.media}
                      alt={story.title}
                      className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70"></div>

                  {/* Content */}
                  <div className="relative z-10 p-4 sm:p-6">
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 bg-green-500/80 rounded-full text-xs font-medium">
                        {story.type === 'video' ? '📹 Video' : '📸 Photo'}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{story.title}</h3>
                    <p className="text-xs sm:text-sm mb-3 sm:mb-4 text-white/90 leading-relaxed line-clamp-3">{story.caption}</p>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => openPopup(story, story.type)}
                        className="inline-flex items-center px-3 sm:px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-105"
                      >
                        <span>Read More</span>
                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <div className="text-xs text-white/70">
                        {story.readTime}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* More Success Stories */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-500 text-center mb-8 sm:mb-12 animate-fade-in-up">
            More Success Stories
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto mt-3 sm:mt-4 rounded-full animate-pulse"></div>
          </h2>

          {/* Success Stories Carousel */}
          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={() => setSuccessStorySlide(prev => prev === 0 ? successStories.length - 1 : prev - 1)}
              className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-green-500 rounded-full p-2 sm:p-3 lg:p-4 shadow-xl transition-all duration-300 hover:scale-125 hover:shadow-2xl border border-gray-200 group animate-bounce-slow"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-500 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => setSuccessStorySlide(prev => prev === successStories.length - 1 ? 0 : prev + 1)}
              className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-green-500 rounded-full p-2 sm:p-3 lg:p-4 shadow-xl transition-all duration-300 hover:scale-125 hover:shadow-2xl border border-gray-200 group animate-bounce-slow"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-500 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Carousel Container */}
            <div className="overflow-hidden rounded-2xl mx-8 sm:mx-10 lg:mx-12">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${successStorySlide * 100}%)` }}
              >
                {successStories.map((story, idx) => (
                  <div key={story.id} className="w-full flex-shrink-0 animate-slide-in">
                    <div className="bg-gradient-to-br from-white via-gray-50 to-green-50 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 hover:shadow-3xl hover:scale-[1.02] transition-all duration-500 hover:border-green-300 group">
                      <div className="p-4 sm:p-6 md:p-8 lg:p-12">
                        {/* Profile Section */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:mb-10">
                          <div className="relative group-hover:scale-105 transition-transform duration-300">
                            <div className="absolute -inset-2 sm:-inset-3 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                            <div className="absolute -inset-1 bg-green-400 rounded-full animate-ping opacity-10"></div>
                            <img
                              src={story.image}
                              alt={`${story.name} Profile`}
                              className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full object-cover border-4 sm:border-6 border-green-500 shadow-2xl relative z-10 group-hover:border-green-400 transition-all duration-300 hover:rotate-1"
                            />
                            <div className="absolute -bottom-2 sm:-bottom-3 -right-2 sm:-right-3 bg-green-500 rounded-full p-2 sm:p-3 shadow-lg group-hover:bg-green-400 group-hover:scale-110 transition-all duration-300 animate-bounce">
                              <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            {/* Decorative ring */}
                            <div className="absolute -inset-2 rounded-full border-2 border-green-200 animate-pulse group-hover:border-green-300 transition-colors duration-300"></div>
                          </div>

                          <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 group-hover:text-green-600 transition-colors duration-300">{story.name}</h3>
                            <p className="text-base sm:text-lg md:text-xl text-green-600 font-semibold mb-1 sm:mb-2 group-hover:text-green-500 transition-colors duration-300">{story.title}</p>
                            <p className="text-sm sm:text-base md:text-lg text-gray-600 flex items-center justify-center sm:justify-start group-hover:text-green-500 transition-colors duration-300">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              {story.location}
                            </p>
                          </div>
                        </div>

                        {/* Story Content */}
                        <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                          <div className="bg-white/70 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border-l-4 border-green-500 group-hover:bg-white/90 group-hover:border-green-400 transition-all duration-300 hover:shadow-lg">
                            {/* Mobile Story (shorter version) */}
                            <p className="text-gray-700 leading-relaxed text-sm italic group-hover:text-gray-800 transition-colors duration-300 block sm:hidden">
                              "{story.mobileStory}"
                            </p>
                            {/* Desktop/Tablet Story (full version) */}
                            <p className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg italic group-hover:text-gray-800 transition-colors duration-300 hidden sm:block">
                              "{story.story}"
                            </p>
                          </div>

                          {/* Call to Action */}
                          <div className="flex flex-col gap-4 sm:gap-6 items-center justify-between pt-6 sm:pt-8 border-t-2 border-green-100 group-hover:border-green-200 transition-colors duration-300">
                            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full">
                              <button
                                onClick={() => openPopup(story, "image")}
                                className="inline-flex items-center px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm sm:text-base font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl group-hover:animate-pulse w-full sm:w-auto"
                              >
                                <span>Read Full Story</span>
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                              <button className="inline-flex items-center px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white text-sm sm:text-base font-bold rounded-xl transition-all duration-300 hover:scale-105 group-hover:border-green-400 w-full sm:w-auto">
                                <span>Share Story</span>
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                </svg>
                              </button>
                            </div>
                            <div className="bg-green-100 rounded-lg px-3 sm:px-4 py-2 w-full sm:w-auto">
                              <div className="text-xs sm:text-sm text-green-700 font-semibold text-center sm:text-left">
                                <span className="font-bold">Impact:</span> {story.impact}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center mt-8 space-x-3 animate-fade-in-up">
              {successStories.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSuccessStorySlide(idx)}
                  className={`relative transition-all duration-500 transform hover:scale-125 ${idx === successStorySlide
                    ? 'w-8 h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-lg animate-pulse'
                    : 'w-3 h-3 bg-gray-300 hover:bg-green-300 rounded-full hover:shadow-md'
                    }`}
                >
                  {idx === successStorySlide && (
                    <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Men of Excellence Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-green-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-teal-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-4 sm:mb-6">
              Men of Excellence
            </h2>
            <div className="w-20 sm:w-28 h-1 bg-gradient-to-r from-emerald-400 to-green-600 mx-auto mb-4 sm:mb-6 rounded-full"></div>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Celebrating exceptional men who have made extraordinary contributions to their communities and fields of expertise.
            </p>
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden relative">
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentExcellenceIndex * 100}%)` }}
              >
                {menOfExcellence.map((person, index) => (
                  <div
                    key={person.id}
                    className="w-full flex-shrink-0 px-2"
                  >
                    <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-green-100/50 mx-auto max-w-sm">
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <div className="relative z-10">
                        {/* Profile Image */}
                        <div className="relative mb-6">
                          <div className="absolute -inset-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse opacity-20"></div>
                          <img
                            src={person.image}
                            alt={`${person.name} Profile`}
                            className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500 shadow-2xl mx-auto relative z-10"
                          />
                          {/* Excellence Badge */}
                          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full p-2 shadow-lg">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="text-center">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {person.name}
                          </h3>
                          <p className="text-sm text-emerald-600 font-semibold mb-2">
                            {person.title}
                          </p>
                          <p className="text-xs text-gray-500 mb-4 flex items-center justify-center">
                            <svg className="w-3 h-3 mr-1 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {person.location}
                          </p>

                          {/* Achievement */}
                          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 mb-4">
                            <p className="text-xs text-gray-700 leading-relaxed">
                              {person.achievement}
                            </p>
                          </div>

                          {/* Impact Badge */}
                          <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg px-3 py-2 mb-4">
                            <div className="text-xs text-white font-semibold">
                              <span className="block">Impact:</span>
                              <span className="block">{person.impact}</span>
                            </div>
                          </div>

                          {/* Action Button */}
                          <button
                            onClick={() => handleProtectedPopup(person, "image")}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-xs font-semibold rounded-xl transition-all duration-300"
                          >
                            {!isSignedIn && (
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            )}
                            <span>Learn More</span>
                            <svg className="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {menOfExcellence.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentExcellenceIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentExcellenceIndex
                    ? 'bg-emerald-500 w-6'
                    : 'bg-emerald-200 hover:bg-emerald-300'
                    }`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => setCurrentExcellenceIndex(prev =>
                prev === 0 ? menOfExcellence.length - 1 : prev - 1
              )}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
            >
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentExcellenceIndex(prev =>
                prev === menOfExcellence.length - 1 ? 0 : prev + 1
              )}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
            >
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Desktop Grid (hidden on mobile) */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {menOfExcellence.map((person, index) => (
              <div
                key={person.id}
                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-green-100/50 hover:border-green-200"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  {/* Profile Image */}
                  <div className="relative mb-6 sm:mb-8">
                    <div className="absolute -inset-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                    <div className="absolute -inset-1 bg-emerald-400 rounded-full animate-ping opacity-10"></div>
                    <img
                      src={person.image}
                      alt={`${person.name} Profile`}
                      className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-emerald-500 shadow-2xl mx-auto relative z-10 group-hover:border-emerald-400 transition-all duration-300 group-hover:scale-105"
                    />
                    {/* Excellence Badge */}
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full p-2 sm:p-3 shadow-lg group-hover:scale-110 transition-all duration-300">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-xl sm:text-2xl lg:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 group-hover:text-emerald-600 transition-colors duration-300">
                      {person.name}
                    </h3>
                    <p className="text-sm sm:text-base lg:text-lg text-emerald-600 font-semibold mb-2 sm:mb-3 group-hover:text-emerald-500 transition-colors duration-300">
                      {person.title}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 flex items-center justify-center group-hover:text-emerald-500 transition-colors duration-300">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {person.location}
                    </p>

                    {/* Achievement */}
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 sm:p-5 mb-4 sm:mb-6 group-hover:from-emerald-100 group-hover:to-green-100 transition-all duration-300">
                      <p className="text-xs sm:text-sm lg:text-base text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                        {person.achievement}
                      </p>
                    </div>

                    {/* Impact Badge */}
                    <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 group-hover:from-emerald-600 group-hover:to-green-700 transition-all duration-300">
                      <div className="text-xs sm:text-sm text-white font-semibold">
                        <span className="block sm:inline">Impact:</span>
                        <span className="block sm:inline sm:ml-1">{person.impact}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleProtectedPopup(person, "image")}
                      className="mt-4 sm:mt-6 inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group-hover:animate-pulse"
                    >
                      {!isSignedIn && (
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                      <span>Learn More</span>
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Section */}
      <section id="career" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-green-50 via-white to-green-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 bg-green-500 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-12 sm:w-18 lg:w-24 h-12 sm:h-18 lg:h-24 bg-green-400 rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-8 sm:w-12 lg:w-16 h-8 sm:h-12 lg:h-16 bg-green-300 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Join Our Mission</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Be part of a team that's making a real difference in people's lives. Explore career opportunities at Purpose Space.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Why Work With Us?</h3>
                </div>
                <ul className="space-y-3 sm:space-y-4">
                  <li className="flex items-start">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-1 mr-2 sm:mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm sm:text-base text-gray-700">Make a meaningful impact on communities</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-1 mr-2 sm:mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm sm:text-base text-gray-700">Collaborative and inclusive work environment</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-1 mr-2 sm:mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm sm:text-base text-gray-700">Professional development opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-1 mr-2 sm:mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm sm:text-base text-gray-700">Competitive benefits and flexible work options</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <button className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm sm:text-base font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <span>View Open Positions</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Content - Career Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6">
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mb-1 sm:mb-2">50+</div>
                <div className="text-sm sm:text-base text-gray-700 font-semibold">Team Members</div>
              </div>
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mb-1 sm:mb-2">15+</div>
                <div className="text-sm sm:text-base text-gray-700 font-semibold">Countries Represented</div>
              </div>
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mb-1 sm:mb-2">95%</div>
                <div className="text-sm sm:text-base text-gray-700 font-semibold">Employee Satisfaction</div>
              </div>
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mb-1 sm:mb-2">24/7</div>
                <div className="text-sm sm:text-base text-gray-700 font-semibold">Global Impact</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Get In Touch</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Ready to make a difference? We'd love to hear from you. Reach out to learn more about our programs or get involved.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 w-full">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Send us a message</h3>
              <form className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                    <input type="text" className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm sm:text-base" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                    <input type="text" className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm sm:text-base" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input type="email" className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm sm:text-base" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                  <input type="text" className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm sm:text-base" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <textarea rows="4" className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none text-sm sm:text-base"></textarea>
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm sm:text-base">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-gray-800">Our Location</h4>
                    <p className="text-sm sm:text-base text-gray-600">123 Purpose Street, Impact City, IC 12345</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-gray-800">Phone</h4>
                    <p className="text-sm sm:text-base text-gray-600">+234 800 123 4567</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-gray-800">Email</h4>
                    <p className="text-sm sm:text-base text-gray-600">support@purposespace.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-gray-800">Office Hours</h4>
                    <p className="text-sm sm:text-base text-gray-600">Mon - Fri: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Logo and Description */}
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="flex items-center mb-3 sm:mb-4">
                <img src="images/logo.png" alt="Purpose Space" className="w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3 rounded-full" />
                <span className="text-xl sm:text-2xl font-bold">Purpose Space</span>
              </div>
              <p className="text-gray-300 mb-4 sm:mb-6 max-w-md text-sm sm:text-base">
                Empowering nurses with knowledge, opportunities, and growth through innovative programs and dedicated partnerships.
              </p>
              <div className="flex space-x-3 sm:space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Quick Links</h4>
              <ul className="space-y-1 sm:space-y-2">
                <li><a href="#about" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">About Us</a></li>
                <li><a href="#blog" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Blog Posts</a></li>
                <li><a href="#spotlights" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Success Stories</a></li>
                <li><a href="#career" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Career Coaching</a></li>
                <li><a href="#contact" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Contact</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Contact Info</h4>
              <div className="space-y-1 sm:space-y-2 text-gray-300 text-sm sm:text-base">
                <p>Purpose Space HQ</p>
                <p>Lagos, Nigeria</p>
                <p>Phone: +234 800 123 4567</p>
                <p>Email: support@purposespace.com</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
            <p className="text-gray-300 text-xs sm:text-sm">
              © 2025 Purpose Space. All rights reserved. | <a href="#contact" className="text-yellow-400 hover:text-yellow-300 transition-colors">Advertise with us</a> | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>

      {/* Popup Component */}
      {showPopup && popupData && (
        <PopupMedia
          type={popupData.type}
          title={popupData.title}
          meta={popupData.meta}
          description={popupData.description}
          imageUrl={popupData.imageUrl}
          videoUrl={popupData.videoUrl}
          onClose={closePopup}
        />
      )}
    </div>
  );
}
