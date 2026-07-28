import { query } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  try {
    const result = await query('SELECT id, email_or_phone, password, created_at FROM users ORDER BY created_at DESC');
    return res.status(200).json({ success: true, users: result.rows });
  } catch (error) {
    console.error('GET /api/admin/users error', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
}
