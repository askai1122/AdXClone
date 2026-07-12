const {
  OverviewForm,
  Clicks,
  Ecpm,
  ImpressionsCountry,
  PerfSummary,
  PricingRules,
  DemandComparison,
  TopAdvertisers,
  YieldPartners,
  LastPayment,
  modelMap,
} = require('../models');

async function saveOverview(req, res) {
  try {
    const {
      network_id,
      impressions,
      impressions_percent,
      revenue,
      revenue_percent,
      ecpm,
      ecpm_percent,
      viewability,
      viewability_percent,
      date_filter,
    } = req.body;

    await OverviewForm.create({
      network_id: network_id || '',
      impressions: impressions || '',
      impressions_percent: impressions_percent || '',
      revenue: revenue || '',
      revenue_percent: revenue_percent || '',
      ecpm: ecpm || '',
      ecpm_percent: ecpm_percent || '',
      viewability: viewability || '',
      viewability_percent: viewability_percent || '',
      date_filter: date_filter || 'today',
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save overview' });
  }
}

async function saveClicks(req, res) {
  try {
    const {
      clicks_total,
      clicks_country_name_1,
      clicks_country_name_2,
      clicks_country_name_3,
      clicks_country_name_4,
      clicks_country_name_5,
      clicks_country_name_6,
      clicks_graph_numbers,
      date_filter,
    } = req.body;

    await Clicks.create({
      clicks_total: clicks_total || '',
      clicks_country_name_1: clicks_country_name_1 || '',
      clicks_country_name_2: clicks_country_name_2 || '',
      clicks_country_name_3: clicks_country_name_3 || '',
      clicks_country_name_4: clicks_country_name_4 || '',
      clicks_country_name_5: clicks_country_name_5 || '',
      clicks_country_name_6: clicks_country_name_6 || '',
      clicks_graph_numbers: clicks_graph_numbers || '',
      date_filter: date_filter || 'today',
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save clicks' });
  }
}

async function saveEcpm(req, res) {
  try {
    const {
      ecpm_total,
      ecpm_country_name_1,
      ecpm_country_name_2,
      ecpm_country_name_3,
      ecpm_country_name_4,
      ecpm_country_name_5,
      ecpm_country_name_6,
      ecpm_graph_numbers,
      date_filter,
    } = req.body;

    await Ecpm.create({
      ecpm_total: ecpm_total || '',
      ecpm_country_name_1: ecpm_country_name_1 || '',
      ecpm_country_name_2: ecpm_country_name_2 || '',
      ecpm_country_name_3: ecpm_country_name_3 || '',
      ecpm_country_name_4: ecpm_country_name_4 || '',
      ecpm_country_name_5: ecpm_country_name_5 || '',
      ecpm_country_name_6: ecpm_country_name_6 || '',
      ecpm_graph_numbers: ecpm_graph_numbers || '',
      date_filter: date_filter || 'today',
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save eCPM' });
  }
}

async function saveImpressions(req, res) {
  try {
    const {
      impressions_total,
      impressions_country_name_1,
      impressions_country_name_2,
      impressions_country_name_3,
      impressions_country_name_4,
      impressions_country_name_5,
      impressions_country_name_6,
      impressions_graph_numbers,
      date_filter,
    } = req.body;

    await ImpressionsCountry.create({
      impressions_total: impressions_total || '',
      impressions_country_name_1: impressions_country_name_1 || '',
      impressions_country_name_2: impressions_country_name_2 || '',
      impressions_country_name_3: impressions_country_name_3 || '',
      impressions_country_name_4: impressions_country_name_4 || '',
      impressions_country_name_5: impressions_country_name_5 || '',
      impressions_country_name_6: impressions_country_name_6 || '',
      impressions_graph_numbers: impressions_graph_numbers || '',
      date_filter: date_filter || 'today',
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save impressions' });
  }
}

async function savePerfSummary(req, res) {
  try {
    const f = req.body;
    await PerfSummary.create({
      ps_impressions: f.ps_impressions || '',
      ps_impressions_change: f.ps_impressions_change || '',
      ps_revenue: f.ps_revenue || '',
      ps_revenue_change: f.ps_revenue_change || '',
      ps_ecpm: f.ps_ecpm || '',
      ps_ecpm_change: f.ps_ecpm_change || '',
      ps_app_1: f.ps_app_1 || '',
      ps_app_2: f.ps_app_2 || '',
      ps_app_3: f.ps_app_3 || '',
      ps_app_4: f.ps_app_4 || '',
      ps_app_5: f.ps_app_5 || '',
      date_filter: f.date_filter || 'today',
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
}

async function savePricingRules(req, res) {
  try {
    const f = req.body;
    await PricingRules.create({
      pr_rule_name: f.pr_rule_name || '',
      pr_impressions: f.pr_impressions || '',
      pr_revenue: f.pr_revenue || '',
      pr_ecpm: f.pr_ecpm || '',
      pr_everything_impressions: f.pr_everything_impressions || '',
      pr_everything_revenue: f.pr_everything_revenue || '',
      pr_everything_ecpm: f.pr_everything_ecpm || '',
      pr_est_revenue: f.pr_est_revenue || '',
      pr_winning_bids: f.pr_winning_bids || '',
      date_filter: f.date_filter || 'today',
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
}

async function saveDemandComparison(req, res) {
  try {
    const f = req.body;
    await DemandComparison.create({
      dc_c1_label: f.dc_c1_label || '',
      dc_c1_value: f.dc_c1_value || '',
      dc_c2_label: f.dc_c2_label || '',
      dc_c2_value: f.dc_c2_value || '',
      dc_c3_label: f.dc_c3_label || '',
      dc_c3_value: f.dc_c3_value || '',
      dc_c4_label: f.dc_c4_label || '',
      dc_c4_value: f.dc_c4_value || '',
      dc_c5_label: f.dc_c5_label || '',
      dc_c5_value: f.dc_c5_value || '',
      date_filter: f.date_filter || 'today',
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
}

async function saveTopAdvertisers(req, res) {
  try {
    const f = req.body;
    const data = { date_filter: f.date_filter || 'today' };

    for (let i = 1; i <= 5; i += 1) {
      ['name', 'impressions', 'revenue', 'ecpm', 'viewability'].forEach((key) => {
        data[`adv${i}_${key}`] = f[`adv${i}_${key}`] || '';
      });
    }

    await TopAdvertisers.create(data);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
}

async function saveYieldPartners(req, res) {
  try {
    const f = req.body;
    const data = { date_filter: f.date_filter || 'today' };

    for (let i = 1; i <= 3; i += 1) {
      data[`yp${i}_name`] = f[`yp${i}_name`] || '';
      data[`yp${i}_impressions`] = f[`yp${i}_impressions`] || '';
      data[`yp${i}_revenue`] = f[`yp${i}_revenue`] || '';
      data[`yp${i}_ecpm`] = f[`yp${i}_ecpm`] || '';

      for (let j = 1; j <= 3; j += 1) {
        data[`yp${i}_sub${j}_name`] = f[`yp${i}_sub${j}_name`] || '';
        data[`yp${i}_sub${j}_impressions`] = f[`yp${i}_sub${j}_impressions`] || '';
        data[`yp${i}_sub${j}_revenue`] = f[`yp${i}_sub${j}_revenue`] || '';
        data[`yp${i}_sub${j}_ecpm`] = f[`yp${i}_sub${j}_ecpm`] || '';
      }
    }

    await YieldPartners.create(data);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed', detail: error.message });
  }
}

function saveGenericTable(tableName) {
  return async (req, res) => {
    try {
      const Model = modelMap[tableName];
      if (!Model) {
        return res.status(500).json({ error: `Unknown table: ${tableName}` });
      }

      const body = { ...req.body };
      if (!body.date_filter) body.date_filter = 'today';

      const fields = Object.keys(body);
      if (fields.length === 0) return res.json({ success: true });

      const data = {};
      fields.forEach((field) => {
        data[field] = body[field] || '';
      });

      await Model.create(data);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

async function saveLastPayment(req, res) {
  try {
    const { lastpaymentdate, last_payment } = req.body;
    await LastPayment.create({
      lastpaymentdate: lastpaymentdate || '',
      last_payment: last_payment || '',
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getLastPayment(req, res) {
  try {
    const row = await LastPayment.findOne()
      .sort({ id: -1 })
      .select('lastpaymentdate last_payment -_id')
      .lean();

    res.json(row || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const GENERIC_TABLES = [
  'payment_page',
  'how_you_get_paid',
  'last_payment_section',
  'transactionform',
  'settingsform',
  'mcm_settings',
  'currentmonthtrans',
  'lastmonthtrans',
  'thirdmonthtrans',
  'reciptform',
  'secondmonthreciptform',
  'thirdmonthreciptform',
];

const genericHandlers = {};
GENERIC_TABLES.forEach((tableName) => {
  genericHandlers[tableName] = saveGenericTable(tableName);
});

module.exports = {
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
};
