import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import PurposeSpace from './Homepage.jsx';
import BlogFeed from './blogpage.jsx';
import Signup from './signup.jsx';
import Signin from './signIn.jsx';
import PopupMedia from './popup.jsx';

// Additional page components for routing
const About = () => (
  <div className="min-h-screen p-8">
    <h1 className="text-3xl font-bold mb-4">About Page</h1>
    <p>This is the about page.</p>
  </div>
);

const Blog = () => (
  <div className="min-h-screen p-8">
    <h1 className="text-3xl font-bold mb-4">Blog</h1>
    <p>Welcome to our blog section.</p>
  </div>
);

const Career = () => (
  <div className="min-h-screen p-8">
    <h1 className="text-3xl font-bold mb-4">Career</h1>
    <p>Explore career opportunities and coaching services.</p>
  </div>
);

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/popup" element={<PopupMedia />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/blogpage" element={<BlogFeed />} /> 
        <Route path="/" element={<PurposeSpace />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/career" element={<Career />} />
        <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl font-bold">404 - Page Not Found</h1></div>} />
      </Routes>
    </div>
  );
};

export default App;
