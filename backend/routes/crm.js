const express = require('express');
const router = express.Router();

router.get('/customers', (req, res) => {
  res.json({ success: true, data: [], message: 'CRM routes - coming soon' });
});

router.post('/customers', (req, res) => {
  res.json({ success: true, message: 'Customer creation - coming soon' });
});

module.exports = router;