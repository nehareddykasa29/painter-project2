import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { loginUser, clearError } from '../store/authSlice';
import './AdminLoginModal.css';

const AdminLoginModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { error, loading, isAuthenticated } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => {
        onClose();
        dispatch(clearError());
      }, 2000);
    }
  }, [isAuthenticated, onClose, dispatch]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser({ email: formData.email, password: formData.password }));
  };

  const handleClose = () => {
    dispatch(clearError());
    setFormData({ email: '', password: '' });
    setShowPassword(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="admin-login-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="admin-login-modal"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>Admin Login</h2>
            <button className="close-button" onClick={handleClose}>
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">
                <FaUser className="input-icon" />
                Email
              </label>
                             <input
                 type="email"
                 id="email"
                 name="email"
                 value={formData.email}
                 onChange={handleInputChange}
                 placeholder="Enter your email"
                 required
                 disabled={loading}
               />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <FaLock className="input-icon" />
                Password
              </label>
              <div className="password-input-container">
                                 <input
                   type={showPassword ? "text" : "password"}
                   id="password"
                   name="password"
                   value={formData.password}
                   onChange={handleInputChange}
                   placeholder="Enter your password"
                   required
                   disabled={loading}
                 />
                                 <button
                   type="button"
                   className="password-toggle"
                   onClick={() => setShowPassword(!showPassword)}
                   disabled={loading}
                 >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

                         {error && (
               <motion.div
                 className="error-message"
                 initial={{ opacity: 0, y: -10 }}
                 animate={{ opacity: 1, y: 0 }}
               >
                 {error}
               </motion.div>
             )}

             {isAuthenticated && (
               <motion.div
                 className="success-message"
                 initial={{ opacity: 0, y: -10 }}
                 animate={{ opacity: 1, y: 0 }}
               >
                 Login successful! Redirecting...
               </motion.div>
             )}

                         <button
               type="submit"
               className="login-button"
               disabled={loading}
             >
               {loading ? 'Logging in...' : 'Login'}
             </button>
          </form>

          <div className="test-credentials">
            <p><strong>Test Credentials:</strong></p>
            <p>Email: admin@painterguys.com</p>
            <p>Password: admin123</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminLoginModal;
