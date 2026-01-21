import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';

export default function BlogPostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentInput, setCommentInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [savedPosts, setSavedPosts] = useState([]);
  const [editingComment, setEditingComment] = useState(null);
  const [editInput, setEditInput] = useState("");

  const userData = JSON.parse(localStorage.getItem('userData') || 'null');
  const currentUserId = userData?._id;

  useEffect(() => {
    fetchBlog();
    const saved = JSON.parse(localStorage.getItem('savedPosts') || '[]');
    setSavedPosts(saved);
  }, [id]);

  const fetchBlog = () => {
    setLoading(true);
    // Ideally this would be a single item fetch like /blog/${id}
    // But since we are not sure of backend, we might need to fetch all and find one, 
    // OR try to fetch single if supported.
    // Let's try fetching all for now as fallback if single fetch isn't guaranteed.
    // Actually, usually /blog returns all.
    axios.get('https://purposespace-backend-b9ecfc575955.herokuapp.com/blog')
      .then(response => {
        if (response.data.status === "SUCCESS") {
          const foundBlog = response.data.data.find(b => b._id === id);
          if (foundBlog) {
            // Handle image paths
            let image = foundBlog.img;
            if (!image && foundBlog.images && foundBlog.images.length > 0) {
              image = foundBlog.images[0];
            }
            
            if (image && typeof image === 'string') {
              if (image.startsWith('/images/')) {
                image = `${import.meta.env.BASE_URL}${image.substring(1)}`;
              } else if (image.startsWith('images/')) {
                image = `${import.meta.env.BASE_URL}${image}`;
              }
            }

            const images = foundBlog.images ? foundBlog.images.map(img => {
                if (typeof img === 'string') {
                   if (img.startsWith('/images/')) return `${import.meta.env.BASE_URL}${img.substring(1)}`;
                   if (img.startsWith('images/')) return `${import.meta.env.BASE_URL}${img}`;
                }
                return img;
            }) : [];

            setBlog({
              ...foundBlog,
              img: image,
              images: images,
              time: new Date(foundBlog.createdAt).toLocaleDateString(),
              url: foundBlog.url || '#'
            });
          } else {
            // Handle not found
            console.error("Blog not found");
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching blog:", err);
        setLoading(false);
      });
  };

  const handleLike = () => {
    if (!currentUserId) {
      alert("Please sign in to like posts.");
      return;
    }

    axios.post(`https://purposespace-backend-b9ecfc575955.herokuapp.com/blog/${id}/like`, { userId: currentUserId })
      .then(response => {
        if (response.data.status === "SUCCESS") {
          setBlog(prev => ({ ...prev, likes: response.data.data.likes }));
        }
      })
      .catch(err => console.error("Error liking blog:", err));
  };

  const handleSave = () => {
    let newSaved;
    if (savedPosts.includes(id)) {
      newSaved = savedPosts.filter(savedId => savedId !== id);
    } else {
      newSaved = [...savedPosts, id];
    }
    setSavedPosts(newSaved);
    localStorage.setItem('savedPosts', JSON.stringify(newSaved));
  };

  const handleComment = () => {
    if (!commentInput.trim()) return;

    if (!currentUserId) {
        alert("Please sign in to comment.");
        return;
    }

    axios.post(`https://purposespace-backend-b9ecfc575955.herokuapp.com/blog/${id}/comment`, {
      text: commentInput,
      author: userData?.name || "Anonymous",
      userId: currentUserId
    })
      .then(response => {
        if (response.data.status === "SUCCESS") {
          setBlog(prev => ({ ...prev, comments: response.data.data.comments }));
          setCommentInput("");
          setShowEmojiPicker(false);
        }
      })
      .catch(err => console.error("Error commenting:", err));
  };

  const onEmojiClick = (emojiObject) => {
    setCommentInput(prev => prev + emojiObject.emoji);
  };

  const handleDeleteComment = (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    axios.delete(`https://purposespace-backend-b9ecfc575955.herokuapp.com/blog/${id}/comment/${commentId}`, {
      data: { userId: currentUserId }
    })
    .then(response => {
      if (response.data.status === "SUCCESS") {
        setBlog(prev => ({ ...prev, comments: response.data.data.comments }));
      }
    })
    .catch(err => console.error("Error deleting comment:", err));
  };

  const handleEditComment = (commentId) => {
    if (!editInput.trim()) return;

    axios.put(`https://purposespace-backend-b9ecfc575955.herokuapp.com/blog/${id}/comment/${commentId}`, {
      text: editInput,
      userId: currentUserId
    })
    .then(response => {
      if (response.data.status === "SUCCESS") {
        setBlog(prev => ({ ...prev, comments: response.data.data.comments }));
        setEditingComment(null);
        setEditInput("");
      }
    })
    .catch(err => console.error("Error editing comment:", err));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-green-600 text-xl font-semibold">Loading post...</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Post not found</h2>
          <button onClick={() => navigate('/blogpage')} className="text-green-600 hover:underline">
            Back to Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/blogpage')}
          className="mb-6 flex items-center text-green-700 hover:text-green-800 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Feed
        </button>

        <article className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
          <div className="flex items-center p-6 border-b border-green-50">
            <img
              src={`${import.meta.env.BASE_URL}images/vision2.jpg`}
              alt="Author"
              className="rounded-full mr-4 border-2 border-green-200 w-14 h-14 object-cover"
            />
            <div className="flex-1">
              <h1 className="font-bold text-gray-900 text-xl sm:text-2xl mb-1">{blog.author}</h1>
              <span className="text-green-600 text-sm font-medium">{blog.time}</span>
            </div>
            <button 
              onClick={handleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                savedPosts.includes(blog._id) 
                  ? "bg-green-100 text-green-700" 
                  : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600"
              }`}
            >
              <svg className="w-5 h-5" fill={savedPosts.includes(blog._id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span className="font-medium">{savedPosts.includes(blog._id) ? "Saved" : "Save Post"}</span>
            </button>
          </div>

          <div className="p-6 sm:p-10">
            <p className="text-gray-800 leading-relaxed text-lg whitespace-pre-line mb-8">{blog.text}</p>
            {blog.images && blog.images.length > 1 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {blog.images.map((img, i) => (
                  <img 
                    key={i} 
                    src={img} 
                    alt={`Blog Image ${i + 1}`} 
                    className="w-full h-64 object-cover rounded-xl shadow-lg hover:scale-[1.02] transition-transform duration-300" 
                  />
                ))}
              </div>
            ) : blog.img && (
              <img src={blog.img} alt="Blog Cover" className="w-full rounded-xl shadow-lg mb-8" />
            )}
          </div>

          <div className="bg-gray-50 p-6 sm:p-10 border-t border-green-100">
            <div className="flex items-center gap-8 mb-8">
              <button 
                onClick={handleLike}
                className={`flex items-center gap-2 transition-colors duration-200 group ${
                  Array.isArray(blog.likes) && blog.likes.includes(currentUserId) 
                    ? "text-red-500" 
                    : "text-gray-600 hover:text-red-500"
                }`}
              >
                <svg className="w-8 h-8 group-hover:scale-110 transition-transform duration-200" fill={Array.isArray(blog.likes) && blog.likes.includes(currentUserId) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="font-semibold text-lg">{Array.isArray(blog.likes) ? blog.likes.length : 0} Likes</span>
              </button>
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="font-semibold text-lg">{blog.comments?.length || 0} Comments</span>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Comments</h3>
              
              <div className="flex gap-4 items-start relative bg-white p-4 rounded-xl shadow-sm border border-green-100">
                 <div className="flex-1 relative">
                    <textarea 
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Share your thoughts..." 
                      className="w-full p-4 pr-12 border border-green-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-200 resize-none h-24"
                    />
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="absolute bottom-4 right-4 text-gray-400 hover:text-yellow-500 transition-colors text-xl"
                    >
                      😊
                    </button>
                    {showEmojiPicker && (
                      <div className="absolute bottom-full right-0 mb-2 z-10 shadow-xl">
                        <div className="fixed inset-0 z-0" onClick={() => setShowEmojiPicker(false)}></div>
                        <div className="relative z-10">
                          <EmojiPicker onEmojiClick={onEmojiClick} width={300} height={400} />
                        </div>
                      </div>
                    )}
                 </div>
                 <button 
                   onClick={handleComment}
                   className="bg-green-600 text-white p-4 rounded-xl hover:bg-green-700 transition-colors shadow-lg h-24 flex items-center justify-center"
                 >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                   </svg>
                 </button>
              </div>

              <div className="space-y-4">
                {blog.comments && blog.comments.length > 0 ? (
                  blog.comments.map((comment, i) => (
                    <div key={i} className="bg-white p-5 rounded-xl border border-green-50 shadow-sm group relative">
                      {editingComment === comment._id ? (
                        <div className="flex flex-col gap-3">
                          <textarea 
                            value={editInput} 
                            onChange={(e) => setEditInput(e.target.value)}
                            className="border border-green-200 rounded-lg p-3 w-full focus:outline-none focus:ring-1 focus:ring-green-200"
                            rows="3"
                            autoFocus
                          />
                          <div className="flex gap-3 justify-end">
                            <button onClick={() => setEditingComment(null)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium">Cancel</button>
                            <button onClick={() => handleEditComment(comment._id)} className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">Save Changes</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                                {comment.author.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-semibold text-gray-800">{comment.author}</span>
                            </div>
                            <span className="text-sm text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed pl-11">{comment.text}</p>
                          {currentUserId && comment.userId === currentUserId && (
                            <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                              <button 
                                onClick={() => {
                                  setEditingComment(comment._id);
                                  setEditInput(comment.text);
                                }}
                                className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                              </button>
                              <button 
                                onClick={() => handleDeleteComment(comment._id)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
                  <div className="text-center py-8 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}