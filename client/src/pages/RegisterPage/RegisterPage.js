import React, { useState } from 'react';
import validator from 'validator';
import { registerUser } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUsernameChange = (e) => {
    const value = e.target.value.trim();
    setUsername(value);
    setSuccess('');
    
    const alphanumericPattern = /^[a-zA-Z0-9_]+$/; // Only letters, numbers, and underscores
    
    // Validate username
    if (value.length < 3 || value.length > 30) {
      setError('Username must be between 3 and 30 characters long.');
    } else if (!alphanumericPattern.test(value)) {
      setError('Username must contain only letters, numbers, and underscores.');
    } else {
      setError(''); // No error
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setSuccess('');

    // Validate email using validator
    if (!validator.isEmail(value)) {
      setError('Please enter a valid email address.');
    } else {
      setError('');
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setSuccess('');

    // Validate password length
    if (value.length < 8) {
      setError('Password must be at least 8 characters long.');
    } else if (value !== confirmPassword) {
      setError('Passwords do not match.')
    } else {
      setError(''); // No error
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setSuccess('');

    // Validate password length
    if (value !== password) {
      setError('Passwords do not match.')
    } else {
      setError(''); // No error
    }
  };

  // Regular expression pattern for username validation
  const usernamePattern = /^[a-zA-Z0-9_-]+$/;

  const validateInputs = () => {
    // Validate username
    if (!username.match(usernamePattern)) {
      setError('Username can only contain alphanumeric characters, underscores, and hyphens.');
      return false;
    }
    if (username.length < 3 || username.length > 30) {
      setError('Username must be between 3 and 30 characters long.');
      return false;
    }

    // Validate password
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    // Reset error if all validations pass
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate inputs before dispatching the action
    if (!validateInputs()) {
        return;
    }

    try {
      const response = await registerUser({ 
        username, 
        email, 
        password 
      });
      setSuccess('Registration successful! You can now log in.');
      setError('');
      navigate('/login');
    } catch (err) {
      setError(err.response.data.error || 'An error occurred');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <br></br>
          <input
            className={styles.input}
            type="text"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <br></br>
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <br></br>
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <br></br>
          <input
            className={styles.input}
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
        </div>
        <button className={styles.button} type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;