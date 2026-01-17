import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import PurposeSpace from './Homepage.jsx';
import BlogFeed from './blogpage.jsx';
import BlogPostDetail from './BlogPostDetail.jsx';
import Signup from './signup.jsx';
import Signin from './signIn.jsx';
import PopupMedia from './popup.jsx';
import VerifyEmail from './emailsent.jsx';
import ForgottenPassword from '../forgottenpassword.jsx';
import Profile from './profile.jsx';
import About from './about.jsx';
import AdminSignup from './adminsignup.jsx';
import AdminSignin from './adminsignin.jsx';



// Additional page components for routing
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
        <Route path="/signin/:userEmail?" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/emailsent/:userEmail" element={<VerifyEmail />} />
        <Route path="/blogpage" element={<BlogFeed />} /> 
        <Route path="/blog/:id" element={<BlogPostDetail />} />
        <Route path="/" element={<PurposeSpace />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/career" element={<Career />} />
        <Route path="/forgottenpassword/:userEmail?" element={<ForgottenPassword />} />
        <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl font-bold">404 - Page Not Found</h1></div>} />
        <Route path="/aboutus" element={<About/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/adminsignup" element={<AdminSignup />} />
        <Route path="/adminsignin/:userEmail?" element={<AdminSignin />} />


      </Routes>
    </div>
  );
};

export default App;