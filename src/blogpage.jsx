import React, { useState, useEffect } from "react";

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

export default function BlogFeed() {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [search, setSearch] = useState("");
  const [blogIndex, setBlogIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [newBlog, setNewBlog] = useState({
    author: "",
    text: "",
    img: null,
    imgPreview: ""
  });

  // Infinite scroll
  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 200
    ) {
      loadMoreBlogs();
    }
  };

  const loadMoreBlogs = () => {
    if (loading || blogIndex >= moreBlogs.length) return;
    setLoading(true);

    setTimeout(() => {
      setBlogs((prev) => [...prev, moreBlogs[blogIndex]]);
      setBlogIndex((prev) => prev + 1);
      setLoading(false);
    }, 1000);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewBlog(prev => ({
          ...prev,
          img: file,
          imgPreview: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleCreateBlog = (e) => {
    e.preventDefault();
    if (!newBlog.author.trim() || !newBlog.text.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    const blogPost = {
      author: newBlog.author,
      time: "Just now",
      text: newBlog.text,
      img: newBlog.imgPreview || "/images/vision.jpeg",
      url: "#"
    };

    setBlogs(prev => [blogPost, ...prev]);
    setNewBlog({ author: "", text: "", img: null, imgPreview: "" });
    setShowCreateForm(false);
  };

  // Reset form
  const resetForm = () => {
    setNewBlog({ author: "", text: "", img: null, imgPreview: "" });
    setShowCreateForm(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [blogIndex, loading]);

  const filteredBlogs = blogs.filter((blog) =>
    blog.text.toLowerCase().includes(search.toLowerCase()) ||
    blog.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white w-full">
      {/* Enhanced Fixed Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-green-200 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <img
                  src="/images/logo.png"
                  alt="Purpose Space Logo"
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="hidden sm:block">
          
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200">All Posts</a>
              <a href="#" className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200">Categories</a>
              <a href="#" className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200">Popular</a>
              <a href="#" className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200">About</a>
            </nav>

            {/* Search and Actions */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search blogs..."
                  className="w-48 sm:w-56 lg:w-64 pl-10 pr-4 py-2 border border-green-200 rounded-full focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-300 text-sm bg-gray-50 focus:bg-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              {/* Mobile Profile Section */}
              <button 
                onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                className="lg:hidden flex items-center gap-2 p-2 rounded-lg hover:bg-green-50 transition-all duration-200 border border-green-200 bg-white/80"
              >
                <img
                  src="/images/vision.jpeg"
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-green-300"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-gray-800 leading-tight">Olaoye Alexander</p>
                  <p className="text-xs text-green-600">Nursing Officer</p>
                </div>
                <svg 
                  className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${showMobileSidebar ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobileSidebar(false)}
          ></div>
          
          {/* Sidebar Content */}
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                <h3 className="text-lg font-bold text-green-700">Profile & Navigation</h3>
                <button 
                  onClick={() => setShowMobileSidebar(false)}
                  className="p-2 rounded-full hover:bg-green-100 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Profile Section */}
              <div className="p-6 text-center border-b border-green-100">
                <img
                  src="/images/vision.jpeg"
                  alt="User"
                  className="mx-auto rounded-full mb-3 border-4 border-green-200 w-20 h-20 object-cover"
                />
                <h3 className="font-bold text-gray-800 text-base">Olaoye Alexander</h3>
                <p className="text-green-600 text-sm font-medium">Nursing Officer & Blogger</p>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4">
                <div className="space-y-2">
                  <a href="#" className="flex items-center py-3 px-4 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 group">
                    <span className="text-lg mr-3 group-hover:scale-110 transition-transform duration-200">🏠</span>
                    <span className="font-medium">Home</span>
                  </a>
                  <a href="#" className="flex items-center py-3 px-4 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 group">
                    <span className="text-lg mr-3 group-hover:scale-110 transition-transform duration-200">📂</span>
                    <span className="font-medium">Categories</span>
                  </a>
                  <a href="#" className="flex items-center py-3 px-4 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 group">
                    <span className="text-lg mr-3 group-hover:scale-110 transition-transform duration-200">🔥</span>
                    <span className="font-medium">Popular</span>
                  </a>
                  <a href="#" className="flex items-center py-3 px-4 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 group">
                    <span className="text-lg mr-3 group-hover:scale-110 transition-transform duration-200">💾</span>
                    <span className="font-medium">Saved</span>
                  </a>
                </div>

                {/* Trending Topics */}
                <div className="mt-6">
                  <h4 className="font-semibold mb-3 text-green-700">Trending Topics</h4>
                  <div className="space-y-2">
                    <div className="flex items-center bg-green-50 px-4 py-3 rounded-lg hover:bg-green-100 cursor-pointer transition-all duration-200 group">
                      <span className="text-green-600 mr-3 group-hover:scale-110 transition-transform duration-200">#</span>
                      <span className="text-gray-700 font-medium">Health</span>
                    </div>
                    <div className="flex items-center bg-green-50 px-4 py-3 rounded-lg hover:bg-green-100 cursor-pointer transition-all duration-200 group">
                      <span className="text-green-600 mr-3 group-hover:scale-110 transition-transform duration-200">#</span>
                      <span className="text-gray-700 font-medium">Tech</span>
                    </div>
                    <div className="flex items-center bg-green-50 px-4 py-3 rounded-lg hover:bg-green-100 cursor-pointer transition-all duration-200 group">
                      <span className="text-green-600 mr-3 group-hover:scale-110 transition-transform duration-200">#</span>
                      <span className="text-gray-700 font-medium">Travel</span>
                    </div>
                    <div className="flex items-center bg-green-50 px-4 py-3 rounded-lg hover:bg-green-100 cursor-pointer transition-all duration-200 group">
                      <span className="text-green-600 mr-3 group-hover:scale-110 transition-transform duration-200">#</span>
                      <span className="text-gray-700 font-medium">Lifestyle</span>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Create Blog Section */}
      <div className="w-full pt-20 sm:pt-24 lg:pt-28 px-3 sm:px-6 lg:px-8 mb-4 lg:mb-8">
        <div className="max-w-5xl mx-auto">
          {!showCreateForm ? (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-green-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
                  <div className="text-center lg:text-left flex-1">
                    <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-lg sm:text-xl lg:text-2xl">✍️</span>
                      </div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        Share Your Story
                      </h2>
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
                      Join our community of storytellers. Share your insights, experiences, and knowledge with readers around the world.
                    </p>
                    <div className="hidden sm:flex items-center gap-4 mt-3 lg:mt-4 justify-center lg:justify-start">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span>Easy to use</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                        </svg>
                        <span>Reach thousands</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:gap-3">
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg sm:rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2 sm:gap-3 group"
                    >
                      <span className="text-base sm:text-lg lg:text-xl group-hover:scale-110 transition-transform duration-200">📝</span>
                      <span className="text-sm sm:text-base lg:text-lg">Start Writing</span>
                    </button>
                    <p className="text-xs text-gray-500 text-center hidden sm:block">No account required</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-2xl border border-green-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📝</span>
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white">Create New Post</h2>
                      <p className="text-green-100 text-sm">Share your story with the world</p>
                    </div>
                  </div>
                  <button
                    onClick={resetForm}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-200 flex items-center justify-center group"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleCreateBlog} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Author Name *</label>
                  <input
                    type="text"
                    value={newBlog.author}
                    onChange={(e) => setNewBlog(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 border border-green-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors duration-200 text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Blog Content *</label>
                  <textarea
                    value={newBlog.text}
                    onChange={(e) => setNewBlog(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Share your story, insights, or news..."
                    rows="8"
                    className="w-full px-4 py-4 border border-green-200 rounded-lg focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-300 resize-vertical text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3 text-base">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Featured Image
                    <span className="text-sm text-gray-500 font-normal">(Optional)</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 sm:p-8 text-center hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="imageUpload"
                    />
                    <label htmlFor="imageUpload" className="cursor-pointer block">
                      {newBlog.imgPreview ? (
                        <div className="space-y-4">
                          <div className="relative inline-block">
                            <img
                              src={newBlog.imgPreview}
                              alt="Preview"
                              className="max-w-full h-48 sm:h-56 object-cover rounded-xl mx-auto shadow-lg"
                            />
                            <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                              <span className="text-white font-medium">Click to change</span>
                            </div>
                          </div>
                          <p className="text-green-600 font-medium">Image uploaded successfully</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-gray-700 font-medium text-lg mb-1">Upload a featured image</p>
                            <p className="text-gray-500 text-sm">Drag and drop or click to browse</p>
                          </div>
                          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                            <span>PNG, JPG, GIF</span>
                            <span>•</span>
                            <span>Max 10MB</span>
                            <span>•</span>
                            <span>Recommended: 1200x630px</span>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-8 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span className="text-lg">Publish Post</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-100 text-gray-700 font-semibold py-4 px-8 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-3 group border border-gray-200"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Sidebar */}
          <aside className="lg:col-span-3 bg-white rounded-xl p-4 lg:p-6 shadow-lg border border-green-100 order-2 lg:order-1 h-fit sticky top-24">
            <div className="text-center mb-4 lg:mb-6">
              <img
                src="/images/vision.jpeg"
                alt="User"
                className="mx-auto rounded-full mb-2 lg:mb-3 border-4 border-green-200 w-16 h-16 sm:w-20 sm:h-20 object-cover"
              />
              <h3 className="font-bold text-gray-800 text-sm sm:text-base">Olaoye Alexander</h3>
              <p className="text-green-600 text-xs sm:text-sm font-medium">Nursing Officer & Blogger</p>
            </div>

            <nav className="mb-4 lg:mb-6">
              <div className="space-y-1 lg:space-y-2">
                <a href="#" className="flex items-center py-2 lg:py-3 px-3 lg:px-4 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 group">
                  <span className="text-base lg:text-lg mr-2 lg:mr-3 group-hover:scale-110 transition-transform duration-200">🏠</span>
                  <span className="font-medium text-sm lg:text-base">Home</span>
                </a>
                <a href="#" className="flex items-center py-2 lg:py-3 px-3 lg:px-4 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 group">
                  <span className="text-base lg:text-lg mr-2 lg:mr-3 group-hover:scale-110 transition-transform duration-200">📂</span>
                  <span className="font-medium text-sm lg:text-base">Categories</span>
                </a>
                <a href="#" className="flex items-center py-2 lg:py-3 px-3 lg:px-4 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 group">
                  <span className="text-base lg:text-lg mr-2 lg:mr-3 group-hover:scale-110 transition-transform duration-200">🔥</span>
                  <span className="font-medium text-sm lg:text-base">Popular</span>
                </a>
                <a href="#" className="flex items-center py-2 lg:py-3 px-3 lg:px-4 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 group">
                  <span className="text-base lg:text-lg mr-2 lg:mr-3 group-hover:scale-110 transition-transform duration-200">💾</span>
                  <span className="font-medium text-sm lg:text-base">Saved</span>
                </a>
              </div>
            </nav>

            <div>
              <h4 className="font-semibold mb-3 lg:mb-4 text-green-700 text-sm lg:text-base">Trending Topics</h4>
              <div className="space-y-1 lg:space-y-2">
                <div className="flex items-center bg-green-50 px-3 lg:px-4 py-2 lg:py-3 rounded-lg hover:bg-green-100 cursor-pointer transition-all duration-200 group">
                  <span className="text-green-600 mr-2 lg:mr-3 group-hover:scale-110 transition-transform duration-200 text-sm lg:text-base">#</span>
                  <span className="text-gray-700 font-medium text-sm lg:text-base">Health</span>
                </div>
                <div className="flex items-center bg-green-50 px-3 lg:px-4 py-2 lg:py-3 rounded-lg hover:bg-green-100 cursor-pointer transition-all duration-200 group">
                  <span className="text-green-600 mr-2 lg:mr-3 group-hover:scale-110 transition-transform duration-200 text-sm lg:text-base">#</span>
                  <span className="text-gray-700 font-medium text-sm lg:text-base">Tech</span>
                </div>
                <div className="flex items-center bg-green-50 px-3 lg:px-4 py-2 lg:py-3 rounded-lg hover:bg-green-100 cursor-pointer transition-all duration-200 group">
                  <span className="text-green-600 mr-2 lg:mr-3 group-hover:scale-110 transition-transform duration-200 text-sm lg:text-base">#</span>
                  <span className="text-gray-700 font-medium text-sm lg:text-base">Travel</span>
                </div>
                <div className="flex items-center bg-green-50 px-3 lg:px-4 py-2 lg:py-3 rounded-lg hover:bg-green-100 cursor-pointer transition-all duration-200 group">
                  <span className="text-green-600 mr-2 lg:mr-3 group-hover:scale-110 transition-transform duration-200 text-sm lg:text-base">#</span>
                  <span className="text-gray-700 font-medium text-sm lg:text-base">Lifestyle</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Center Feed */}
          <main className="lg:col-span-6 flex flex-col gap-6 order-1 lg:order-2">
            {filteredBlogs.map((blog, idx) => (
              <article
                key={idx}
                className="bg-white rounded-xl shadow-lg cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all duration-300 border border-green-100 hover:border-green-300 overflow-hidden"
                onClick={() => window.location.href = blog.url}
              >
                <div className="flex items-center p-5 border-b border-green-50">
                  <img
                    src="/images/vision2.jpg"
                    alt="Author"
                    className="rounded-full mr-4 border-2 border-green-200 w-12 h-12 object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-base">{blog.author}</h3>
                    <span className="text-green-600 text-sm font-medium">{blog.time}</span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line mb-4">{blog.text}</p>
                </div>
                <img src={blog.img} alt="Blog Cover" className="w-full h-64 object-cover hover:opacity-95 transition-opacity duration-300" />
              </article>
            ))}
            {loading && (
              <div className="text-center py-8">
                <p className="text-green-600 font-medium text-base">Loading more blogs...</p>
              </div>
            )}
          </main>

          {/* Right Sidebar */}
          <aside className="lg:col-span-3 bg-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-xl border border-green-100 flex flex-col gap-6 order-3 h-fit sticky top-24">
            <div>
              <h4 className="font-semibold mb-4 text-green-700 text-base border-b border-green-100 pb-2">Trending Blogs</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-green-600 hover:text-green-800 hover:underline transition-colors duration-200 block text-sm leading-relaxed">5 Morning Habits of Successful People</a></li>
                <li><a href="#" className="text-green-600 hover:text-green-800 hover:underline transition-colors duration-200 block text-sm leading-relaxed">Top 10 Travel Spots in 2025</a></li>
                <li><a href="#" className="text-green-600 hover:text-green-800 hover:underline transition-colors duration-200 block text-sm leading-relaxed">AI in Healthcare: What's Next?</a></li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border border-green-200">
              <h4 className="font-semibold mb-4 text-green-700 text-base">Subscribe to Newsletter</h4>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-green-200 rounded-lg mb-3 text-gray-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-200 text-sm"
              />
              <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium">
                Subscribe Now
              </button>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-green-700 text-base border-b border-green-100 pb-2">Sponsored</h4>
              <div className="rounded-xl overflow-hidden border border-green-200 hover:border-green-300 transition-colors duration-200">
                <img src="/images/vision.jpeg" alt="Advertisement" className="w-full h-32 object-cover" />
                <div className="p-3 bg-green-50">
                  <p className="text-xs text-gray-600">Sponsored Content</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-green-700 text-base border-b border-green-100 pb-2">Recent Comments</h4>
              <div className="space-y-3">
                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                  <p className="text-gray-600 text-sm"><span className="font-semibold text-green-700">Mary:</span> Great tips, thanks!</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                  <p className="text-gray-600 text-sm"><span className="font-semibold text-green-700">Alex:</span> Can't wait to try this.</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-green-700 text-base border-b border-green-100 pb-2">Popular Tags</h4>
              <div className="flex flex-wrap gap-2">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs hover:bg-green-200 cursor-pointer transition-colors duration-200 font-medium">#health</span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs hover:bg-green-200 cursor-pointer transition-colors duration-200 font-medium">#tech</span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs hover:bg-green-200 cursor-pointer transition-colors duration-200 font-medium">#travel</span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs hover:bg-green-200 cursor-pointer transition-colors duration-200 font-medium">#food</span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs hover:bg-green-200 cursor-pointer transition-colors duration-200 font-medium">#fitness</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-xl border border-green-200">
              <h4 className="font-semibold mb-4 text-green-700 text-base text-center">Follow Us</h4>
              <div className="flex justify-center space-x-4">
                <a href="#" className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors duration-200 text-lg">📘</a>
                <a href="#" className="w-10 h-10 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center hover:bg-sky-200 transition-colors duration-200 text-lg">🐦</a>
                <a href="#" className="w-10 h-10 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center hover:bg-pink-200 transition-colors duration-200 text-lg">📸</a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}