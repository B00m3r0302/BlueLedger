const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, data: [], message: 'Shipments routes - coming soon' });
});

router.post('/', (req, res) => {
  res.json({ success: true, message: 'Shipment creation - coming soon' });
});

module.exports = router;