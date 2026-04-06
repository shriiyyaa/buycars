import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';

function BuyCarsLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#C0392B"/>
      <path d="M6 20.5L8.5 13.5C8.8 12.6 9.65 12 10.6 12H21.4C22.35 12 23.2 12.6 23.5 13.5L26 20.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="5" y="20" width="22" height="5" rx="2" fill="white"/>
      <circle cx="10" cy="25" r="2.5" fill="#C0392B" stroke="white" strokeWidth="1"/>
      <circle cx="22" cy="25" r="2.5" fill="#C0392B" stroke="white" strokeWidth="1"/>
      <rect x="5" y="20" width="22" height="2" rx="1" fill="#E74C3C"/>
    </svg>
  );
}

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('name', data.name);
      localStorage.setItem('userId', data.userId);
      navigate('/manage-cars');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo"><BuyCarsLogo size={40} /></div>
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to your dealer account</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Email Address</label>
            <input type="email" placeholder="dealer@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input type="password" placeholder="Your password"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '6px' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="switch-link">New dealer? <Link to="/signup">Create account</Link></p>
      </div>
    </div>
  );
}

export default Login;