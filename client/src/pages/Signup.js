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

function Signup() {
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    phone: '', dealership_name: '', city: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/signup', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('name', data.name);
      localStorage.setItem('userId', data.userId);
      navigate('/manage-cars');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally { setLoading(false); }
  };

  const f = (field) => ({
    value: form[field],
    onChange: e => setForm({ ...form, [field]: e.target.value })
  });

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo"><BuyCarsLogo size={40} /></div>
        <h2>Create Dealer Account</h2>
        <p className="subtitle">Join thousands of verified dealers on BuyCars</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Full Name</label>
            <input type="text" placeholder="Rahul Sharma" {...f('name')} required />
          </div>
          <div className="form-field">
            <label>Dealership Name</label>
            <input type="text" placeholder="Sharma Auto Sales" {...f('dealership_name')} />
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Email Address</label>
              <input type="email" placeholder="rahul@dealer.com" {...f('email')} required />
            </div>
            <div className="form-field">
              <label>Phone Number</label>
              <input type="tel" placeholder="+91 98765 43210" {...f('phone')} />
            </div>
          </div>
          <div className="form-field">
            <label>City</label>
            <input type="text" placeholder="Mumbai" {...f('city')} />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input type="password" placeholder="Minimum 8 characters" {...f('password')} required />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '6px' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="switch-link">Already registered? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}

export default Signup;