const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { getStats } = require('../controllers/statsController');
const {
  saveOverview,
  saveClicks,
  saveEcpm,
  saveImpressions,
  savePerfSummary,
  savePricingRules,
  saveDemandComparison,
  saveTopAdvertisers,
  saveYieldPartners,
  saveLastPayment,
  getLastPayment,
  genericHandlers,
} = require('../controllers/dataController');
const { saveDataLegacy, getDataLegacy } = require('../controllers/legacyController');

const router = express.Router();

router.post('/overview', requireAuth, saveOverview);
router.post('/clicks', requireAuth, saveClicks);
router.post('/ecpm', requireAuth, saveEcpm);
router.post('/impressions', requireAuth, saveImpressions);
router.post('/perf_summary', requireAuth, savePerfSummary);
router.post('/pricing_rules', requireAuth, savePricingRules);
router.post('/demand_comparison', requireAuth, saveDemandComparison);
router.post('/top_advertisers', requireAuth, saveTopAdvertisers);
router.post('/yield_partners', requireAuth, saveYieldPartners);
router.post('/last_payment', requireAuth, saveLastPayment);
router.get('/last_payment', getLastPayment);
router.post('/save-data-legacy', requireAuth, saveDataLegacy);
router.get('/get-data-legacy', getDataLegacy);

Object.entries(genericHandlers).forEach(([tableName, handler]) => {
  router.post(`/${tableName}`, handler);
});

module.exports = router;
