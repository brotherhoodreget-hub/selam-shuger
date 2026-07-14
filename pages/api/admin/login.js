const ADMIN_EMAIL = 'shugerselam@admin.com';
const ADMIN_PASSWORD = 'Qazx1234';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return res.status(200).json({
      success: true,
      message: 'Admin login successful',
      admin: {
        email: ADMIN_EMAIL,
        role: 'admin'
      }
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid email or password.' });
}
