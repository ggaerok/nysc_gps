const { getRunning } = require('../lib');
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ running: await getRunning() });
};
