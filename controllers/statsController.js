const {
  OverviewForm,
  Clicks,
  Ecpm,
  ImpressionsCountry,
  modelMap,
} = require('../models');
const { getLatestRecord } = require('../utils/dbHelpers');

const GLOBAL_TABLES = [
  'settingsform',
  'how_you_get_paid',
  'last_payment_section',
  'last_payment',
  'payment_page',
  'mcm_settings',
];

const EXTRA_TABLES = [
  'payment_page',
  'last_payment_section',
  'last_payment',
  'how_you_get_paid',
  'mcm_settings',
  'transactionform',
  'settingsform',
  'currentmonthtrans',
  'lastmonthtrans',
  'thirdmonthtrans',
  'reciptform',
  'secondmonthreciptform',
  'thirdmonthreciptform',
  'perf_summary',
  'pricing_rules',
  'demand_comparison',
  'top_advertisers',
  'yield_partners',
];

async function getStats(req, res) {
  const dateFilter = req.query.date_filter || 'last_30_days';

  const result = {
    overview_form: {},
    clicks: {},
    ecpm: {},
    impressions_country: {},
    active_date_filter: dateFilter,
  };

  const overviewRow = await getLatestRecord(OverviewForm, dateFilter);
  if (overviewRow) {
    result.overview_form = {
      network_id: overviewRow.network_id,
      impressions: overviewRow.impressions,
      impressions_percent: overviewRow.impressions_percent,
      revenue: overviewRow.revenue,
      revenue_percent: overviewRow.revenue_percent,
      ecpm: overviewRow.ecpm,
      ecpm_percent: overviewRow.ecpm_percent,
      viewability: overviewRow.viewability,
      viewability_percent: overviewRow.viewability_percent,
    };
  }

  const clicksRow = await getLatestRecord(Clicks, dateFilter);
  if (clicksRow) {
    result.clicks = {
      clicks_total: clicksRow.clicks_total,
      clicks_country_name_1: clicksRow.clicks_country_name_1,
      clicks_country_name_2: clicksRow.clicks_country_name_2,
      clicks_country_name_3: clicksRow.clicks_country_name_3,
      clicks_country_name_4: clicksRow.clicks_country_name_4,
      clicks_country_name_5: clicksRow.clicks_country_name_5,
      clicks_country_name_6: clicksRow.clicks_country_name_6,
      clicks_graph_numbers: clicksRow.clicks_graph_numbers,
    };
  }

  const ecpmRow = await getLatestRecord(Ecpm, dateFilter);
  if (ecpmRow) {
    result.ecpm = {
      ecpm_total: ecpmRow.ecpm_total,
      ecpm_country_name_1: ecpmRow.ecpm_country_name_1,
      ecpm_country_name_2: ecpmRow.ecpm_country_name_2,
      ecpm_country_name_3: ecpmRow.ecpm_country_name_3,
      ecpm_country_name_4: ecpmRow.ecpm_country_name_4,
      ecpm_country_name_5: ecpmRow.ecpm_country_name_5,
      ecpm_country_name_6: ecpmRow.ecpm_country_name_6,
      ecpm_graph_numbers: ecpmRow.ecpm__graph_numbers || ecpmRow.ecpm_graph_numbers,
    };
  }

  const impressionsRow = await getLatestRecord(ImpressionsCountry, dateFilter);
  if (impressionsRow) {
    result.impressions_country = {
      impressions_total: impressionsRow.impressions_total,
      impressions_country_name_1: impressionsRow.impressions_country_name_1,
      impressions_country_name_2: impressionsRow.impressions_country_name_2,
      impressions_country_name_3: impressionsRow.impressions_country_name_3,
      impressions_country_name_4: impressionsRow.impressions_country_name_4,
      impressions_country_name_5: impressionsRow.impressions_country_name_5,
      impressions_country_name_6: impressionsRow.impressions_country_name_6,
      impressions_graph_numbers: impressionsRow.impressions__graph_numbers || impressionsRow.impressions_graph_numbers,
    };
  }

  await Promise.all(
    EXTRA_TABLES.map(async (tableName) => {
      const Model = modelMap[tableName];
      const isGlobal = GLOBAL_TABLES.includes(tableName);
      const row = await getLatestRecord(Model, dateFilter, isGlobal);
      result[tableName] = row || {};
    })
  );

  res.json(result);
}

module.exports = { getStats };
