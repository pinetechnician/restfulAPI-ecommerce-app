// src/pages/ProfilePage.js
import React, { useEffect, useState } from 'react';
import validator from 'validator';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateUserProfile } from '../../redux/profile/profileSlice';
import styles from './ProfilePage.module.css';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');  
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);
  
  const handleUsernameChange = (e) => {
    const value = e.target.value.trim();
    setUsername(value);
    setSuccess('');
    
    const alphanumericPattern = /^[a-zA-Z0-9_]+$/; // Only letters, numbers, and underscores
    
    // Validate username
    if (value.length < 3 || value.length > 30) {
      setLocalError('Username must be between 3 and 30 characters long.');
    } else if (!alphanumericPattern.test(value)) {
      setLocalError('Username must contain only letters, numbers, and underscores.');
    } else {
      setLocalError(''); // No error
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setSuccess('');

    // Validate email using validator
    if (!validator.isEmail(value)) {
      setLocalError('Please enter a valid email address.');
    } else {
      setLocalError('');
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setSuccess('');

    if (value.length < 8) {
      setLocalError('Password must be at least 8 characters long.');
    } else if (confirmPassword && value !== confirmPassword) {
      setLocalError('Passwords do not match.');
    } else {
      setLocalError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setSuccess('');

    if (value !== password) {
      setLocalError('Passwords do not match.');
    } else {
      setLocalError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !email) {
      setLocalError('Please fill out all required fields.');
      return;
    }

    if (password && password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    const userId = user.userId;
    const updateData = { userId, username, email };

    if (password) {
      updateData.password = password;
    }

    dispatch(updateUserProfile(updateData))
      .then(() => {
        setSuccess('Profile updated successfully');
        setLocalError('');
      })
      .catch((err) => {
        setLocalError(err.message || 'An error occurred while updating your profile.');
      });
  };

  //toggle password field visibility
  const togglePasswordFields = () => {
    setShowPasswordFields((prevState) => !prevState); 
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Profile</h2>
      {localError && <p style={{ color: 'red' }}>{localError}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {user && (
        <form className={styles.profileForm} onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <button
            type="button"
            onClick={togglePasswordFields}
            className={styles.passwordToggle}
          >
            {showPasswordFields ? 'Cancel' : 'Change Password'}
          </button>

          {showPasswordFields && (
            <>
              <div>
                <label>New Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Leave blank to keep current password"
                />
              </div>
              <div>
                <label>Confirm New Password:</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Confirm your new password"
                />
              </div>
            </>
          )}

          <button type="submit">Update Profile</button>
        </form>
      )}
    </div>
  );
};

export default Profile;