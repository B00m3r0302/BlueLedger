const express = require('express');
const { requireRole } = require('../middleware/auth');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, data: [], message: 'Contracts routes - coming soon' });
});

router.post('/', requireRole(['admin', 'manager']), (req, res) => {
  res.json({ success: true, message: 'Contract creation - coming soon' });
});

router.put('/:id', requireRole(['admin', 'manager']), (req, res) => {
  res.json({ success: true, message: 'Contract update - coming soon' });
});

router.delete('/:id', requireRole(['admin']), (req, res) => {
  res.json({ success: true, message: 'Contract deletion - coming soon' });
});

module.exports = router;