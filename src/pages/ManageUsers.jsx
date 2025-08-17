import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, addUser, deleteUser } from '../store/usersThunks';
import './ManageUsers.css';

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector(state => state.auth);

  // Users state from Redux
  const usersState = useSelector(state => state.users);
  const users = usersState.users || [];
  const responseMessage = usersState.responseMessage || '';
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Staff'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(fetchUsers({ token }));
    }
  }, [isAuthenticated, token, dispatch]);

  const handlePost = () => {
    setShowModal(true);
    setForm({ name: '', email: '', password: '', role: 'Staff' });
    setError('');
  };

  const handleInputChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    dispatch(addUser({ token, form }))
      .unwrap()
      .then(newUser => {
        setShowModal(false);
      })
      .catch(err => {
        // Show backend error message
        setError(err.message || err.error || 'Failed to create user');
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = async (userId, userRole) => {
    if (userRole === 'Owner') return;
    dispatch(deleteUser({ token, userId, userRole }))
      .unwrap()
      .catch(err => {
        alert(err.message || 'Failed to delete user');
      });
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
          {/* Modal for adding user */}
          {showModal && (
            <div className="modal-overlay" style={{
              position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
              background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
            }}>
              <div className="modal-content" style={{
                background: '#fff', padding: '2rem', borderRadius: '8px', minWidth: '320px', boxShadow: '0 2px 12px rgba(0,0,0,0.15)'
              }}>
                <h3 style={{ marginBottom: '1rem' }}>Add New User</h3>
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      required
                      style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label>Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      required
                      style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label>Password:</label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleInputChange}
                      required
                      style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label>Role:</label>
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                    >
                      <option value="Staff">Staff</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" disabled={loading} style={{ padding: '8px 16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '4px' }}>
                      {loading ? 'Posting...' : 'Post User'}
                    </button>
                    <button type="button" onClick={() => setShowModal(false)} style={{ padding: '8px 16px', background: '#eee', border: 'none', borderRadius: '4px' }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Users Table */}
          <div className="users-table-container" style={{ marginTop: '2rem' }}>
            {responseMessage && (
              <div style={{ marginBottom: '1rem', color: '#d32f2f', fontWeight: 500 }}>
                {responseMessage}
              </div>
            )}
            {(!users || users.length === 0) && responseMessage ? null : (
              <>
                <h2 style={{ marginBottom: '1rem', fontWeight: 600 }}>User List</h2>
                <table className="users-table" style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <thead>
                    <tr style={{ background: '#f5f5f5' }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>Name</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>Email</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>Role</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>Created At</th>
                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e0e0e0' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users && users.length > 0 ? (
                      users.map((user, idx) => (
                        <tr
                          key={user._id}
                          style={{
                            background: idx % 2 === 0 ? '#fff' : '#fafafa',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#e3f2fd'}
                          onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : '#fafafa'}
                        >
                          <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee' }}>{user.name}</td>
                          <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee' }}>{user.email}</td>
                          <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee' }}>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '12px',
                              background: user.role === 'Admin' ? '#1976d2' : '#e0e0e0',
                              color: user.role === 'Admin' ? '#fff' : '#333',
                              fontWeight: 500,
                              fontSize: '0.95em'
                            }}>
                              {user.role}
                            </span>
                          </td>
                          <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', fontSize: '0.95em', color: '#666' }}>
                            {new Date(user.createdAt).toLocaleString()}
                          </td>
                          <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
                            <button
                              onClick={() => handleDelete(user._id, user.role)}
                              disabled={user.role === 'Owner'}
                              style={{
                                background: user.role === 'Owner' ? '#ccc' : '#d32f2f',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '6px 10px',
                                cursor: user.role === 'Owner' ? 'not-allowed' : 'pointer'
                              }}
                              title={user.role === 'Owner' ? "Cannot delete Owner" : "Delete User"}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ padding: '16px', textAlign: 'center', color: '#888' }}>No users found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ManageUsers;
