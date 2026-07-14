import { query } from '../../../lib/db';

export default async function handler(req, res) {
  const {
    query: { id }
  } = req;

  if (req.method === 'DELETE') {
    try {
      const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
      return res.status(200).json({ success: true, message: 'User deleted.' });
    } catch (error) {
      console.error('DELETE /api/users/[id] error', error);
      return res.status(500).json({ success: false, message: 'Server error.' });
    }
  }

  res.setHeader('Allow', ['DELETE']);
  return res.status(405).json({ success: false, message: 'Method not allowed.' });
}
