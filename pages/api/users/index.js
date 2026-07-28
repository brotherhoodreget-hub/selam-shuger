import { query } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await query('SELECT id, email_or_phone, password, created_at FROM users ORDER BY created_at DESC');
      return res.status(200).json({ success: true, users: result.rows });
    } catch (error) {
      console.error('GET /api/users error', error);
      return res.status(500).json({ success: false, message: 'Server error.' });
    }
  }

  if (req.method === 'POST') {
    const { loginInput, password } = req.body;
    if (!loginInput || !password) {
      return res.status(400).json({ success: false, message: 'Missing credentials.' });
    }

    try {
      const result = await query(
        `INSERT INTO users (email_or_phone, password) VALUES ($1, $2) ON CONFLICT (email_or_phone) DO UPDATE SET password = $2 RETURNING id, email_or_phone, password, created_at`,
        [loginInput, password]
      );
      return res.status(200).json({ success: true, user: result.rows[0] });
    } catch (error) {
      console.error('POST /api/users error', error);
      return res.status(500).json({ success: false, message: 'Server error.' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ success: false, message: 'Method not allowed.' });
}
