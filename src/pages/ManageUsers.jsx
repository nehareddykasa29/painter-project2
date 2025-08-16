import React from 'react';
import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';
import './ManageUsers.css';

const ManageUsers = () => {
  const handlePost = () => {
    // No functionality - button is just for display
  };

  return (
    <div className="manage-users-page">
      <section className="hero-section">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Manage Users</h1>
            <p>User management dashboard</p>
          </motion.div>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <div className="post-button-container">
            <button 
              className="post-btn"
              onClick={handlePost}
            >
              <FaPlus />
              Post
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ManageUsers;
