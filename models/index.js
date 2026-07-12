const createModel = require('./createModel');

const OverviewForm = createModel('overview_form', [
  'network_id',
  'impressions',
  'impressions_percent',
  'revenue',
  'revenue_percent',
  'ecpm',
  'ecpm_percent',
  'viewability',
  'viewability_percent',
], { includeDateFilter: true });

const Clicks = createModel('clicks', [
  'clicks_total',
  'clicks_country_name_1',
  'clicks_country_name_2',
  'clicks_country_name_3',
  'clicks_country_name_4',
  'clicks_country_name_5',
  'clicks_country_name_6',
  'clicks_graph_numbers',
], { includeDateFilter: true });

const Ecpm = createModel('ecpm', [
  'ecpm_total',
  'ecpm_country_name_1',
  'ecpm_country_name_2',
  'ecpm_country_name_3',
  'ecpm_country_name_4',
  'ecpm_country_name_5',
  'ecpm_country_name_6',
  'ecpm_graph_numbers',
], { includeDateFilter: true });

const ImpressionsCountry = createModel('impressions_country', [
  'impressions_total',
  'impressions_country_name_1',
  'impressions_country_name_2',
  'impressions_country_name_3',
  'impressions_country_name_4',
  'impressions_country_name_5',
  'impressions_country_name_6',
  'impressions_graph_numbers',
], { includeDateFilter: true });

const PerfSummary = createModel('perf_summary', [
  'ps_impressions',
  'ps_impressions_change',
  'ps_revenue',
  'ps_revenue_change',
  'ps_ecpm',
  'ps_ecpm_change',
  'ps_app_1',
  'ps_app_2',
  'ps_app_3',
  'ps_app_4',
  'ps_app_5',
], { includeDateFilter: true });

const PricingRules = createModel('pricing_rules', [
  'pr_rule_name',
  'pr_impressions',
  'pr_revenue',
  'pr_ecpm',
  'pr_everything_impressions',
  'pr_everything_revenue',
  'pr_everything_ecpm',
  'pr_est_revenue',
  'pr_winning_bids',
], { includeDateFilter: true });

const DemandComparison = createModel('demand_comparison', [
  'dc_c1_label',
  'dc_c1_value',
  'dc_c2_label',
  'dc_c2_value',
  'dc_c3_label',
  'dc_c3_value',
  'dc_c4_label',
  'dc_c4_value',
  'dc_c5_label',
  'dc_c5_value',
], { includeDateFilter: true });

const topAdvertiserFields = [];
for (let i = 1; i <= 5; i += 1) {
  ['name', 'impressions', 'revenue', 'ecpm', 'viewability'].forEach((key) => {
    topAdvertiserFields.push(`adv${i}_${key}`);
  });
}
const TopAdvertisers = createModel('top_advertisers', topAdvertiserFields, { includeDateFilter: true });

const yieldPartnerFields = [];
for (let i = 1; i <= 3; i += 1) {
  yieldPartnerFields.push(
    `yp${i}_name`,
    `yp${i}_impressions`,
    `yp${i}_revenue`,
    `yp${i}_ecpm`
  );
  for (let j = 1; j <= 3; j += 1) {
    yieldPartnerFields.push(
      `yp${i}_sub${j}_name`,
      `yp${i}_sub${j}_impressions`,
      `yp${i}_sub${j}_revenue`,
      `yp${i}_sub${j}_ecpm`
    );
  }
}
const YieldPartners = createModel('yield_partners', yieldPartnerFields, { includeDateFilter: true });

const PaymentPage = createModel('payment_page', [
  'earnings',
  'lastpaymentdate',
  'bankaccountname',
  'lastthreedigits',
]);

const HowYouGetPaid = createModel('how_you_get_paid', [
  'lastthreedigits',
  'bankaccountname',
], { includeDateFilter: true });

const LastPaymentSection = createModel('last_payment_section', [
  'lastpaymentdate',
  'last_payment',
]);

const LastPayment = createModel('last_payment', [
  'lastpaymentdate',
  'last_payment',
]);

const TransactionForm = createModel('transactionform', [
  'firstmonth',
  'firstmonthdate',
  'secondmonth',
  'secondmonthdate',
  'thirdmonth',
  'thirdmonthdate',
]);

const SettingsForm = createModel('settingsform', [
  'publisherid',
  'publishername',
  'publisheruser',
  'network_id',
  'site_name',
  'mcm_parent_url',
  'mcm_network_code',
  'mcm_invitation_status',
  'mcm_delegation_type',
]);

const McmSettings = createModel('mcm_settings', [
  'site_name',
  'mcm_parent_url',
  'mcm_network_code',
  'mcm_invitation_status',
  'mcm_delegation_type',
], { includeDateFilter: true });

const CurrentMonthTrans = createModel('currentmonthtrans', [
  'startingbalance',
  'endingbalance',
  'firstmonthreciptdate',
  'banknumber',
  'amount',
  'firstmonthtitledate',
  'firstmonthtitle',
  'firstmonthtitleamount',
  'firstmonthinvaliddate',
  'firstmonthinvalidtitle',
  'firstmonthinvalidamount',
  'firstmonthextrainvaliddate',
  'firstmonthextrainvalidtitle',
  'firstmonthextrainvalidamount',
]);

const LastMonthTrans = createModel('lastmonthtrans', [
  'secondmonthstartingbalance',
  'secondmonthendingbalance',
  'secondmonthreciptdate',
  'secondmonthbanknumber',
  'secondmonthamount',
  'secondmonthtitledate',
  'secondmonthtitle',
  'secondmonthtitleamount',
  'secondmonthinvaliddate',
  'secondmonthinvalidtitle',
  'secondmonthinvalidamount',
  'secondmonthextrainvaliddate',
  'secondmonthextrainvalidtitle',
  'secondmonthextrainvalidamount',
]);

const ThirdMonthTrans = createModel('thirdmonthtrans', [
  'thirdmonthstartingbalance',
  'thirdmonthendingbalance',
  'thirdmonthreciptdate',
  'thirdmonthbanknumber',
  'thirdmonthamount',
  'thirdmonthtitledate',
  'thirdmonthtitle',
  'thirdmonthtitleamount',
  'thirdmonthinvaliddate',
  'thirdmonthinvalidtitle',
  'thirdmonthinvalidamount',
  'thirdmonthextrainvaliddate',
  'thirdmonthextrainvalidtitle',
  'thirdmonthextrainvalidamount',
]);

const receiptFields = [
  'paymentdate',
  'billingid',
  'taxidentification',
  'paymentmethod',
  'paymentnumber',
  'Amount',
  'address',
];

const ReciptForm = createModel('reciptform', receiptFields);
const SecondMonthReciptForm = createModel('secondmonthreciptform', receiptFields);
const ThirdMonthReciptForm = createModel('thirdmonthreciptform', receiptFields);

const modelMap = {
  overview_form: OverviewForm,
  clicks: Clicks,
  ecpm: Ecpm,
  impressions_country: ImpressionsCountry,
  perf_summary: PerfSummary,
  pricing_rules: PricingRules,
  demand_comparison: DemandComparison,
  top_advertisers: TopAdvertisers,
  yield_partners: YieldPartners,
  payment_page: PaymentPage,
  how_you_get_paid: HowYouGetPaid,
  last_payment_section: LastPaymentSection,
  last_payment: LastPayment,
  transactionform: TransactionForm,
  settingsform: SettingsForm,
  mcm_settings: McmSettings,
  currentmonthtrans: CurrentMonthTrans,
  lastmonthtrans: LastMonthTrans,
  thirdmonthtrans: ThirdMonthTrans,
  reciptform: ReciptForm,
  secondmonthreciptform: SecondMonthReciptForm,
  thirdmonthreciptform: ThirdMonthReciptForm,
};

module.exports = {
  OverviewForm,
  Clicks,
  Ecpm,
  ImpressionsCountry,
  PerfSummary,
  PricingRules,
  DemandComparison,
  TopAdvertisers,
  YieldPartners,
  PaymentPage,
  HowYouGetPaid,
  LastPaymentSection,
  LastPayment,
  TransactionForm,
  SettingsForm,
  McmSettings,
  CurrentMonthTrans,
  LastMonthTrans,
  ThirdMonthTrans,
  ReciptForm,
  SecondMonthReciptForm,
  ThirdMonthReciptForm,
  modelMap,
};
