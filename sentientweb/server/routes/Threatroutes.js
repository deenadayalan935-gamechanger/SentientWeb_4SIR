import express from 'express';
import ThreatAudit from '../models/ThreatAudit.js';

const router = express.Router();

router.get('/history', async (req, res) => {
  try {
    const threats = await ThreatAudit.find()
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, threats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const total = await ThreatAudit.countDocuments();
    const critical = await ThreatAudit.countDocuments({ threatLevel: 'CRITICAL' });
    const high = await ThreatAudit.countDocuments({ threatLevel: 'HIGH' });
    const medium = await ThreatAudit.countDocuments({ threatLevel: 'MEDIUM' });
    res.json({ success: true, total, critical, high, medium });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;