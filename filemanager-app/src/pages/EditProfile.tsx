import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';

const EditProfile: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/auth/profile/', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setUsername(data.username || '');
        setEmail(data.email || '');
      })
      .catch(() => setError('Failed to load profile'));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!password) {
      setError('Please enter your password to confirm changes.');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to update your profile?');
    if (!confirmed) return;

    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/profile/', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password, // backend expects it named exactly like this
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Update failed');
      }

      setMessage('Profile updated successfully!');
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <input
          type="text"
          placeholder="New Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="New Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Current Password (required)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <div className="form-buttons">
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => navigate(-1)}>Cancel</button>
          <button type="button" onClick={() => navigate('/change-password')}>
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
