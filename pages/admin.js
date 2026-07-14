import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const API_BASE = '/api';

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

export default function Admin() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState({ id: null, field: null });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const adminSession = localStorage.getItem('admin_session');
    if (!adminSession) {
      router.replace('/admin-login');
      return;
    }
    loadUsers();
  }, [router]);

  const loadUsers = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/admin/users`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.users || []);
      } else {
        setError(data.message || 'Unable to load users.');
      }
    } catch (err) {
      setError('Network error. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_token');
    router.push('/admin-login');
  };

  const handleCopy = async (value, userId, field) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied({ id: userId, field });
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`${API_BASE}/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.success) {
        setUsers((current) => current.filter((item) => item.id !== userId));
        if (copied.id === userId) {
          setCopied({ id: null, field: null });
        }
      } else {
        setError(data.message || 'Could not delete user.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <>
      <Head>
        <title>Admin - User Management</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin - User Management</h1>
          <button onClick={handleLogout} className="btn btn-logout">Logout</button>
        </div>

        <div className="admin-content">
          {error && <div className="error-message">{error}</div>}
          {loading ? (
            <div className="empty-state">Loading users…</div>
          ) : users.length === 0 ? (
            <div className="empty-state">No users registered yet.</div>
          ) : (
            <div className="users-grid">
              {users.map((user) => (
                <div key={user.id} className={`user-card ${copied.id === user.id ? 'copied' : ''}`}>
                  <div className="card-header">
                    <h3 className="card-title">User #{user.id}</h3>
                    <div className="card-timestamp">{formatDate(user.created_at)}</div>
                  </div>
                  <div className="card-content">
                    <div className="card-field">
                      <span className="field-label">Email/Phone:</span>
                      <span className="field-value">{user.email_or_phone}</span>
                      <button
                        className={`btn-copy-field ${copied.id === user.id && copied.field === 'email' ? 'active' : ''}`}
                        type="button"
                        onClick={() => handleCopy(user.email_or_phone, user.id, 'email')}
                      >
                        Copy
                      </button>
                    </div>
                    <div className="card-field">
                      <span className="field-label">Password:</span>
                      <span className="field-value">{user.password}</span>
                      <button
                        className={`btn-copy-field ${copied.id === user.id && copied.field === 'password' ? 'active' : ''}`}
                        type="button"
                        onClick={() => handleCopy(user.password, user.id, 'password')}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button className="btn-delete" type="button" onClick={() => handleDelete(user.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
