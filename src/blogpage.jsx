import React, { useState, useEffect } from "react";
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';
import { useNavigate } from 'react-router-dom';
import Loader from './loader.jsx';

export default function BlogFeed() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  // const [blogIndex, setBlogIndex] = useState(0); // Infinite scroll disabled for now
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [newBlog, setNewBlog] = useState({
    text: "",
    images: [],
    imagePreviews: []
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const [activeCommentSection, setActiveCommentSection] = useState(null); // Track which blog's comments are open
  const [editingComment, setEditingComment] = useState(null); // Track which comment is being edited
  const [editInput, setEditInput] = useState(""); // Track edit input value
  const [activeEmojiPicker, setActiveEmojiPicker] = useState(null); // Track which blog's comment section has emoji picker open
  const [savedPosts, setSavedPosts] = useState([]); // Track saved blog IDs
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'saved'
  const [creatingBlog, setCreatingBlog] = useState(false);
  const [commentingOn, setCommentingOn] = useState(null);
  const [subscribing, setSubscribing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : {
      name: "Olaoye Alexander",
      title: "Nursing Officer & Blogger",
      image: "images/vision.jpeg"
    };
  });
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [tempProfile, setTempProfile] = useState(userProfile);
  const [showImageViewer, setShowImageViewer] = useState(false);

  // Get current user from localStorage
  const userData = JSON.parse(localStorage.getItem('userData') || 'null');
  const currentUserId = userData?._id;

  // Fetch blogs from backend
  useEffect(() => {
    fetchBlogs();
    // Load saved posts from localStorage
    const saved = JSON.parse(localStorage.getItem('savedPosts') || '[]');
    setSavedPosts(saved);
  }, []);

  const fetchBlogs = () => {
    setLoading(true);
    axios.get('https://purposespace-backend-b9ecfc575955.herokuapp.com/blog')
      .then(response => {
        if (response.data.status === "SUCCESS") {
          const formattedBlogs = response.data.data.map(blog => ({
            ...blog,
            time: new Date(blog.createdAt).toLocaleDateString(),
            url: blog.url || '#'
          }));
          setBlogs(formattedBlogs);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching blogs:", err);
        setLoading(false);
      });
  };

  /* Infinite scroll disabled for simple connection
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
  */

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const fileReaders = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(fileReaders).then(previews => {
       setNewBlog(prev => ({
         ...prev,
         images: [...(prev.images || []), ...files],
         imagePreviews: [...(prev.imagePreviews || []), ...previews]
       }));
    });
  };

  const removeImage = (index) => {
    setNewBlog(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index)
    }));
  };

  const onEmojiClick = (emojiObject) => {
    setNewBlog(prev => ({
      ...prev,
      text: prev.text + emojiObject.emoji
    }));
  };

  const onCommentEmojiClick = (emojiObject, blogId) => {
    setCommentInputs(prev => ({
      ...prev,
      [blogId]: (prev[blogId] || "") + emojiObject.emoji
    }));
  };

  // Handle Save
  const handleSave = (blogId) => {
    let newSaved;
    if (savedPosts.includes(blogId)) {
      newSaved = savedPosts.filter(id => id !== blogId);
    } else {
      newSaved = [...savedPosts, blogId];
    }
    setSavedPosts(newSaved);
    localStorage.setItem('savedPosts', JSON.stringify(newSaved));
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setUserProfile(tempProfile);
    localStorage.setItem('userProfile', JSON.stringify(tempProfile));
    
    // Update userData if name changed so new posts use the new name
    if (userData) {
        const updatedUserData = { ...userData, name: tempProfile.name };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
    }
    
    setShowProfileEdit(false);
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfile(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleCreateBlog = (e) => {
    e.preventDefault();
    if (!newBlog.text.trim()) {
      alert("Please enter some content for your blog");
      return;
    }
    
    setCreatingBlog(true);

    const blogData = {
      author: userData?.name || "Anonymous",
      userId: currentUserId,
      text: newBlog.text,
      img: newBlog.imagePreviews?.[0] || "/images/vision.jpeg",
      images: newBlog.imagePreviews || []
    };

    if (isEditing && currentEditId) {
        // Update existing blog
        axios.put(`https://purposespace-backend-b9ecfc575955.herokuapp.com/blog/${currentEditId}`, blogData)
            .then(response => {
                if (response.data.status === "SUCCESS") {
                    setBlogs(prev => prev.map(b => b._id === currentEditId ? { ...b, ...response.data.data, time: new Date(response.data.data.createdAt).toLocaleDateString() } : b));
                    resetForm();
                } else {
                    alert("Failed to update blog: " + response.data.message);
                }
            })
            .catch(err => {
                console.error("Error updating blog:", err);
                alert("An error occurred while updating the blog.");
            })
            .finally(() => setCreatingBlog(false));
    } else {
        // Create new blog
        axios.post('https://purposespace-backend-b9ecfc575955.herokuapp.com/blog', blogData)
          .then(response => {
            if (response.data.status === "SUCCESS") {
              // Add the new blog to the list
              const createdBlog = {
                ...response.data.data,
                images: blogData.images, // Ensure images are present locally even if backend doesn't return them
                time: new Date(response.data.data.createdAt).toLocaleDateString(),
                url: '#'
              };
              setBlogs(prev => [createdBlog, ...prev]);
              resetForm();
            } else {
              alert("Failed to create blog: " + response.data.message);
            }
          })
          .catch(err => {
            console.error("Error creating blog:", err);
            alert("An error occurred while creating the blog.");
          })
          .finally(() => {
            setCreatingBlog(false);
          });
    }
  };

  const handleDeleteBlog = (blogId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    
    axios.delete(`https://purposespace-backend-b9ecfc575955.herokuapp.com/blog/${blogId}`, { data: { userId: currentUserId } })
        .then(res => {
            if (res.data.status === "SUCCESS") {
                setBlogs(prev => prev.filter(b => b._id !== blogId));
            } else {
                alert(res.data.message);
            }
        })
        .catch(err => console.error("Error deleting blog:", err));
  };

  const handleEditBlogInitiate = (blog) => {
    setNewBlog({
        text: blog.text,
        images: blog.images || [],
        imagePreviews: blog.images || (blog.img ? [blog.img] : [])
    });
    setIsEditing(true);
    setCurrentEditId(blog._id);
    setShowCreateForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = async (blog) => {
    const shareData = {
      title: blog.author + "'s Post",
      text: blog.text.substring(0, 100) + "...",
      url: `${window.location.origin}/blog/${blog._id}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  // Handle Like
  const handleLike = (blogId) => {
    if (!currentUserId) {
      alert("Please sign in to like posts.");
      return;
    }

    axios.post(`https://purposespace-backend-b9ecfc575955.herokuapp.com/blog/${blogId}/like`, { userId: currentUserId })
      .then(response => {
        if (response.data.status === "SUCCESS") {
          setBlogs(prevBlogs => prevBlogs.map(blog => 
            blog._id === blogId ? { ...blog, likes: response.data.data.likes } : blog
          ));
        }
      })
      .catch(err => console.error("Error liking blog:", err));
  };

  // Handle Comment
  const handleComment = (blogId) => {
    const commentText = commentInputs[blogId];
    if (!commentText?.trim()) return;

    if (!currentUserId) {
        alert("Please sign in to comment.");
        return;
    }

    setCommentingOn(blogId);

    axios.post(`https://purposespace-backend-b9ecfc575955.herokuapp.com/blog/${blogId}/comment`, {
      text: commentText,
      author: userData?.name || "Anonymous",
      userId: currentUserId
    })
      .then(response => {
        if (response.data.status === "SUCCESS") {
          setBlogs(prevBlogs => prevBlogs.map(blog => 
            blog._id === blogId ? { ...blog, comments: response.data.data.comments } : blog
          ));
          setCommentInputs(prev => ({ ...prev, [blogId]: "" }));
        }
      })
      .catch(err => console.error("Error commenting:", err))
      .finally(() => {
        setCommentingOn(null);
      });
  };

  const handleSubscribe = () => {
    setSubscribing(true);
    setTimeout(() => {
        setSubscribing(false);
        alert("Subscribed successfully!");
    }, 2000);
  };

  // Handle Delete Comment
  const handleDeleteComment = (blogId, commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    axios.delete(`https://purposespace-backend-b9ecfc575955.herokuapp.com/blog/${blogId}/comment/${commentId}`, {
      data: { userId: currentUserId }
    })
    .then(response => {
      if (response.data.status === "SUCCESS") {
        setBlogs(prevBlogs => prevBlogs.map(blog => 
          blog._id === blogId ? { ...blog, comments: response.data.data.comments } : blog
        ));
      } else {
        alert(response.data.message);
      }
    })
    .catch(err => console.error("Error deleting comment:", err));
  };

  // Handle Edit Comment
  const handleEditComment = (blogId, commentId) => {
    if (!editInput.trim()) return;

    axios.put(`https://purposespace-backend-b9ecfc575955.herokuapp.com/blog/${blogId}/comment/${commentId}`, {
      text: editInput,
      userId: currentUserId
    })
    .then(response => {
      if (response.data.status === "SUCCESS") {
        setBlogs(prevBlogs => prevBlogs.map(blog => 
          blog._id === blogId ? { ...blog, comments: response.data.data.comments } : blog
        ));
        setEditingComment(null);
        setEditInput("");
      } else {
        alert(response.data.message);
      }
    })
    .catch(err => console.error("Error editing comment:", err));
  };

  // Reset form
  const resetForm = () => {
    setNewBlog({ text: "", images: [], imagePreviews: [] });
    setShowEmojiPicker(false);
    setShowCreateForm(false);
    setIsEditing(false);
    setCurrentEditId(null);
  };

  useEffect(() => {
    // window.addEventListener("scroll", handleScroll);
    // return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Removed scroll listener for now

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.text.toLowerCase().includes(search.toLowerCase()) ||
      blog.author.toLowerCase().includes(search.toLowerCase());
    
    if (viewMode === 'saved') {
      return matchesSearch && savedPosts.includes(blog._id);
    }
    
    if (viewMode === 'popular') {
      // Return all matching blogs, but they will be sorted by likes in the render or here
      // To implement sorting, we should probably sort the result array
      return matchesSearch;
    }

    return matchesSearch;
  }).sort((a, b) => {
    if (viewMode === 'popular') {
      const likesA = Array.isArray(a.likes) ? a.likes.length : 0;
      const likesB = Array.isArray(b.likes) ? b.likes.length : 0;
      return likesB - likesA; // Descending order
    }
    return 0; // No sorting for other modes (keeps original order)
  });

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
                  src="images/logo.png"
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
              <button onClick={() => setViewMode('all')} className={`font-medium transition-colors duration-200 ${viewMode === 'all' ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}>All Posts</button>
              <button onClick={() => setViewMode('popular')} className={`font-medium transition-colors duration-200 ${viewMode === 'popular' ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}>Popular</button>
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
                  src="images/vision.jpeg"
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
                  src="images/vision.jpeg"
                  alt="User"
                  className="mx-auto rounded-full mb-3 border-4 border-green-200 w-20 h-20 object-cover"
                />
                <h3 className="font-bold text-gray-800 text-base">Olaoye Alexander</h3>
                <p className="text-green-600 text-sm font-medium">Nursing Officer & Blogger</p>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4">
                <div className="space-y-2">
                  <button onClick={() => navigate('/')} className="w-full flex items-center py-3 px-4 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 group">
                    <span className="text-lg mr-3 group-hover:scale-110 transition-transform duration-200">🏠</span>
                    <span className="font-medium">Home</span>
                  </button>
                  <button onClick={() => { setViewMode('popular'); setShowMobileSidebar(false); }} className={`w-full flex items-center py-3 px-4 rounded-lg transition-all duration-200 group ${viewMode === 'popular' ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:text-green-600 hover:bg-green-50'}`}>
                    <span className="text-lg mr-3 group-hover:scale-110 transition-transform duration-200">🔥</span>
                    <span className="font-medium">Popular</span>
                  </button>
                  <button onClick={() => { setViewMode('saved'); setShowMobileSidebar(false); }} className={`w-full flex items-center py-3 px-4 rounded-lg transition-all duration-200 group ${viewMode === 'saved' ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:text-green-600 hover:bg-green-50'}`}>
                    <span className="text-lg mr-3 group-hover:scale-110 transition-transform duration-200">💾</span>
                    <span className="font-medium">Saved</span>
                  </button>
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
                      <h2 className="text-2xl sm:text-3xl font-bold text-white">{isEditing ? "Edit Post" : "Create New Post"}</h2>
                      <p className="text-green-100 text-sm">{isEditing ? "Update your story" : "Share your story with the world"}</p>
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
                <div className="relative">
                  <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Blog Content *</label>
                  <textarea
                    value={newBlog.text}
                    onChange={(e) => setNewBlog(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Share your story, insights, or news..."
                    rows="8"
                    className="w-full px-4 py-4 border border-green-200 rounded-lg focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-300 resize-vertical text-sm sm:text-base"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="absolute bottom-4 right-4 text-2xl hover:scale-110 transition-transform"
                    title="Add Emoji"
                  >
                    😊
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute bottom-16 right-0 z-10 shadow-xl">
                      <EmojiPicker onEmojiClick={onEmojiClick} width={300} height={400} />
                    </div>
                  )}
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
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="imageUpload"
                    />
                    <label htmlFor="imageUpload" className="cursor-pointer block">
                      {newBlog.imagePreviews && newBlog.imagePreviews.length > 0 ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {newBlog.imagePreviews.map((preview, idx) => (
                              <div key={idx} className="relative group/image">
                                <img
                                  src={preview}
                                  alt={`Preview ${idx + 1}`}
                                  className="w-full h-32 object-cover rounded-lg shadow-md"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    removeImage(idx);
                                  }}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover/image:opacity-100 transition-opacity"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-center gap-2">
                             <p className="text-green-600 font-medium">{newBlog.imagePreviews.length} images selected</p>
                             <span className="text-gray-400 text-sm">(Click to add more)</span>
                          </div>
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
                    disabled={creatingBlog}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-8 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {creatingBlog ? (
                      <Loader height="24" width="24" className="flex justify-center items-center" />
                    ) : (
                      <>
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span className="text-lg">{isEditing ? "Update Post" : "Publish Post"}</span>
                  </>
                    )}
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
              <div className="relative inline-block group cursor-pointer" onClick={() => setShowImageViewer(true)}>
                <img
                  src={userProfile.image}
                  alt="User"
                  className="mx-auto rounded-full mb-2 lg:mb-3 border-4 border-green-200 w-16 h-16 sm:w-20 sm:h-20 object-cover transition-opacity duration-300 group-hover:opacity-75"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 rounded-full">
                  <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-gray-800 text-sm sm:text-base">{userProfile.name}</h3>
              <p className="text-green-600 text-xs sm:text-sm font-medium">{userProfile.title}</p>
            </div>

            <nav className="mb-4 lg:mb-6">
              <div className="space-y-1 lg:space-y-2">
                <button onClick={() => navigate('/')} className="w-full flex items-center py-2 lg:py-3 px-3 lg:px-4 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 group">
                  <span className="text-base lg:text-lg mr-2 lg:mr-3 group-hover:scale-110 transition-transform duration-200">🏠</span>
                  <span className="font-medium text-sm lg:text-base">Home</span>
                </button>
                <button onClick={() => setViewMode('popular')} className={`w-full flex items-center py-2 lg:py-3 px-3 lg:px-4 rounded-lg transition-all duration-200 group ${viewMode === 'popular' ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:text-green-600 hover:bg-green-50'}`}>
                  <span className="text-base lg:text-lg mr-2 lg:mr-3 group-hover:scale-110 transition-transform duration-200">🔥</span>
                  <span className="font-medium text-sm lg:text-base">Popular</span>
                </button>
                <button onClick={() => setViewMode('saved')} className={`w-full flex items-center py-2 lg:py-3 px-3 lg:px-4 rounded-lg transition-all duration-200 group ${viewMode === 'saved' ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:text-green-600 hover:bg-green-50'}`}>
                  <span className="text-base lg:text-lg mr-2 lg:mr-3 group-hover:scale-110 transition-transform duration-200">💾</span>
                  <span className="font-medium text-sm lg:text-base">Saved</span>
                </button>
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
                        onClick={() => navigate(`/blog/${blog._id}`)}
                      >
                        <div className="flex items-center p-5 border-b border-green-50">
                          <img
                            src="images/vision2.jpg"
                            alt="Author"
                            className="rounded-full mr-4 border-2 border-green-200 w-12 h-12 object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 text-base">{blog.author}</h3>
                            <span className="text-green-600 text-sm font-medium">{blog.time}</span>
                          </div>
                          {(currentUserId && (blog.userId === currentUserId || userData?.role === 'admin')) && (
                              <div className="flex gap-2">
                                  {blog.userId === currentUserId && (
                                    <button onClick={(e) => { e.stopPropagation(); handleEditBlogInitiate(blog); }} className="text-gray-400 hover:text-blue-500 transition-colors p-1" title="Edit Post">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    </button>
                                  )}
                                  <button onClick={(e) => { e.stopPropagation(); handleDeleteBlog(blog._id); }} className="text-gray-400 hover:text-red-500 transition-colors p-1" title="Delete Post">
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                  </button>
                              </div>
                          )}
                        </div>
                        <div className="p-5">
                          <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line mb-4">
                            {blog.text.length > 200 ? `${blog.text.substring(0, 200)}...` : blog.text}
                            {blog.text.length > 200 && (
                              <span className="text-green-600 font-medium hover:underline ml-2">Read more</span>
                            )}
                          </p>
                        </div>
                {blog.images && blog.images.length > 1 ? (
                   <div className="grid grid-cols-2 gap-1 h-64 overflow-hidden">
                     {blog.images.slice(0, 4).map((img, i) => (
                        <img key={i} src={img} alt="Blog Cover" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                     ))}
                   </div>
                ) : (
                   <img src={blog.img} alt="Blog Cover" className="w-full h-64 object-cover hover:opacity-95 transition-opacity duration-300" />
                )}
                
                {/* Interaction Section */}
                <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleLike(blog._id); }}
                      className={`flex items-center gap-2 transition-colors duration-200 group ${
                        Array.isArray(blog.likes) && blog.likes.includes(currentUserId) 
                          ? "text-red-500" 
                          : "text-gray-600 hover:text-red-500"
                      }`}
                    >
                      <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" fill={Array.isArray(blog.likes) && blog.likes.includes(currentUserId) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="font-medium">{Array.isArray(blog.likes) ? blog.likes.length : 0} Likes</span>
                    </button>
                    
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setActiveCommentSection(activeCommentSection === blog._id ? null : blog._id); 
                      }}
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors duration-200 group"
                    >
                      <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="font-medium">{blog.comments?.length || 0} Comments</span>
                    </button>

                    <button 
                      onClick={(e) => { e.stopPropagation(); handleSave(blog._id); }}
                      className={`flex items-center gap-2 transition-colors duration-200 group ${
                        savedPosts.includes(blog._id) 
                          ? "text-green-600" 
                          : "text-gray-600 hover:text-green-600"
                      }`}
                    >
                      <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" fill={savedPosts.includes(blog._id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      <span className="font-medium">{savedPosts.includes(blog._id) ? "Saved" : "Save"}</span>
                    </button>

                    <button 
                      onClick={(e) => { e.stopPropagation(); handleShare(blog); }}
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors duration-200 group"
                    >
                      <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      <span className="font-medium">Share</span>
                    </button>
                  </div>

                  {/* Comments Dropdown */}
                  {activeCommentSection === blog._id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
                      <div className="space-y-4 mb-4 max-h-60 overflow-y-auto custom-scrollbar">
                        {blog.comments && blog.comments.length > 0 ? (
                          blog.comments.map((comment, i) => (
                            <div key={i} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm group relative">
                              {editingComment === comment._id ? (
                                <div className="flex flex-col gap-2">
                                  <input 
                                    type="text" 
                                    value={editInput} 
                                    onChange={(e) => setEditInput(e.target.value)}
                                    className="border rounded p-2 text-sm w-full"
                                    autoFocus
                                  />
                                  <div className="flex gap-2 justify-end">
                                    <button onClick={() => setEditingComment(null)} className="text-xs text-gray-500 hover:text-gray-700">Cancel</button>
                                    <button onClick={() => handleEditComment(blog._id, comment._id)} className="text-xs text-green-600 font-semibold hover:text-green-700">Save</button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold text-sm text-gray-800">{comment.author}</span>
                                    <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                  </div>
                                  <p className="text-gray-600 text-sm">{comment.text}</p>
                                  
                                  {/* Edit/Delete Actions for Owner */}
                                  {currentUserId && comment.userId === currentUserId && (
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                      <button 
                                        onClick={() => {
                                          setEditingComment(comment._id);
                                          setEditInput(comment.text);
                                        }}
                                        className="text-blue-500 hover:text-blue-700"
                                        title="Edit"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteComment(blog._id, comment._id)}
                                        className="text-red-500 hover:text-red-700"
                                        title="Delete"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                      </button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-500 text-sm py-2">No comments yet. Be the first!</p>
                        )}
                      </div>
                      
                      <div className="flex gap-2 items-center relative">
                        <div className="relative flex-1">
                          <input 
                            type="text" 
                            value={commentInputs[blog._id] || ""}
                            onChange={(e) => setCommentInputs(prev => ({ ...prev, [blog._id]: e.target.value }))}
                            placeholder="Write a comment..." 
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-200 text-sm"
                            onKeyDown={(e) => { if (e.key === 'Enter') handleComment(blog._id); }}
                          />
                          <button
                            onClick={() => setActiveEmojiPicker(activeEmojiPicker === blog._id ? null : blog._id)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition-colors"
                          >
                            😊
                          </button>
                          {activeEmojiPicker === blog._id && (
                            <div className="absolute bottom-12 right-0 z-50 shadow-xl">
                              <div className="fixed inset-0 z-40" onClick={() => setActiveEmojiPicker(null)}></div>
                              <div className="relative z-50">
                                <EmojiPicker onEmojiClick={(emojiObject) => onCommentEmojiClick(emojiObject, blog._id)} width={300} height={400} />
                              </div>
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={() => handleComment(blog._id)}
                          disabled={commentingOn === blog._id}
                          className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed w-10 h-10 flex items-center justify-center"
                        >
                          {commentingOn === blog._id ? (
                            <Loader height="20" width="20" className="flex justify-center items-center" />
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
              <button 
                onClick={handleSubscribe}
                disabled={subscribing}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {subscribing ? (
                  <Loader height="20" width="20" className="flex justify-center items-center" />
                ) : (
                  "Subscribe Now"
                )}
              </button>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-green-700 text-base border-b border-green-100 pb-2">Sponsored</h4>
              <div className="rounded-xl overflow-hidden border border-green-200 hover:border-green-300 transition-colors duration-200">
                <img src="images/vision.jpeg" alt="Advertisement" className="w-full h-32 object-cover" />
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
      {/* Profile Image Viewer Modal */}
      {showImageViewer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200" onClick={() => setShowImageViewer(false)}>
          <div className="relative max-w-4xl max-h-screen w-full flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
            <img 
              src={userProfile.image} 
              alt="Profile Full" 
              className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl mb-6 border-4 border-white/10" 
            />
            <div className="flex gap-4">
              <button 
                onClick={() => { 
                  setShowImageViewer(false); 
                  setTempProfile(userProfile); 
                  setShowProfileEdit(true); 
                }} 
                className="px-6 py-2.5 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all duration-200 font-semibold flex items-center gap-2 shadow-lg hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Profile
              </button>
              <button 
                onClick={() => setShowImageViewer(false)} 
                className="px-6 py-2.5 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all duration-200 font-semibold backdrop-blur-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {showProfileEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Edit Profile</h3>
                <button 
                  onClick={() => setShowProfileEdit(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="flex justify-center">
                  <div className="relative group cursor-pointer">
                    <img 
                      src={tempProfile.image} 
                      alt="Profile Preview" 
                      className="w-24 h-24 rounded-full object-cover border-4 border-green-100"
                    />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageUpload} />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    value={tempProfile.name}
                    onChange={(e) => setTempProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Title / Bio</label>
                  <input
                    type="text"
                    value={tempProfile.title}
                    onChange={(e) => setTempProfile(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowProfileEdit(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
