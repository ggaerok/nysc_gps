const { getRunning, setRunning, checkPassword } = require('../lib');
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  const { password, action } = req.body || {};
  if (!checkPassword(password)) return res.status(401).json({ error: '비밀번호가 올바르지 않습니다.' });
  if (action === 'start') await setRunning(true);
  else if (action === 'stop') await setRunning(false);
  res.status(200).json({ running: await getRunning() });
};
