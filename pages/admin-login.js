import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const API_BASE = '/api';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('admin_session')) {
      router.replace('/admin');
    }
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });
      const data = await response.json();

      if (data.success) {
        localStorage.setItem('admin_session', JSON.stringify(data.admin));
        if (data.token) {
          localStorage.setItem('admin_token', data.token);
        }
        router.push('/admin');
        return;
      }

      setError(data.message || 'Login failed. Please try again.');
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login</title>
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
              <img src="/selam.jpg" alt="Admin Panel" />
            </div>
            <p className="tagline">Admin Panel Login</p>
          </div>
          <form onSubmit={handleSubmit} className="form">
            <input
              className="input"
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn btn-facebook" type="submit">Login as Admin</button>
          </form>
          <div className="error-message">{error}</div>
          <div className="help-links">
            <Link href="/" className="link">Back to User Login</Link>
          </div>
        </div>
        <div className="meta-branding">
          <img className="meta-logo" src="/meta_logo.png" alt="Meta" />
        </div>
      </div>
    </>
  );
}
