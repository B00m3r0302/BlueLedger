const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
  res.json({ success: true, data: {}, message: 'Analytics dashboard - coming soon' });
});

router.get('/reports', (req, res) => {
  res.json({ success: true, data: [], message: 'Analytics reports - coming soon' });
});

module.exports = router;