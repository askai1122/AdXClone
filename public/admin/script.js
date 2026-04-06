document.addEventListener('DOMContentLoaded', () => {
  loadAllStats();

  document.getElementById('overviewForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveOverviewData();
  });

  document.querySelectorAll('.country-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formType = form.closest('.form-card').dataset.form;
      await saveCountryData(formType);
    });
  });
});

async function loadAllStats() {
  try {
    const response = await fetch('/stats');
    const data = await response.json();
    
    // Overview
    if (data.overview_form) {
      document.getElementById('impressions').value = data.overview_form.impressions || '';
      document.getElementById('impressions_percent').value = data.overview_form.impressions_percent || '';
      document.getElementById('revenue').value = data.overview_form.revenue || '';
      document.getElementById('revenue_percent').value = data.overview_form.revenue_percent || '';
    }
    
    // Clicks
    if (data.clicks) {
      document.getElementById('clicks_total').value = data.clicks.clicks_total || '';
      for (let i = 1; i <= 6; i++) {
        document.getElementById(`clicks_country_name_${i}`).value = data.clicks[`clicks_country_name_${i}`] || '';
      }
    }
    
    // eCPM
    if (data.ecpm) {
      document.getElementById('ecpm_total').value = data.ecpm.ecpm_total || '';
      for (let i = 1; i <= 6; i++) {
        document.getElementById(`ecpm_country_name_${i}`).value = data.ecpm[`ecpm_country_name_${i}`] || '';
      }
    }
    
    // Impressions Country
    if (data.impressions_country) {
      document.getElementById('impressions_total').value = data.impressions_country.impressions_total || '';
      for (let i = 1; i <= 6; i++) {
        document.getElementById(`impressions_country_name_${i}`).value = data.impressions_country[`impressions_country_name_${i}`] || '';
      }
    }
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
}

async function saveOverviewData() {
  const formData = {
    impressions: document.getElementById('impressions').value || '',
    impressions_percent: document.getElementById('impressions_percent').value || '',
    revenue: document.getElementById('revenue').value || '',
    revenue_percent: document.getElementById('revenue_percent').value || ''
  };
  await saveData('/api/overview', formData, 'overview-message');
}

async function saveCountryData(formType) {
  const formData = {
    [`${formType}_total`]: document.getElementById(`${formType}_total`).value || '',
  };
  for (let i = 1; i <= 6; i++) {
    formData[`${formType}_country_name_${i}`] = document.getElementById(`${formType}_country_name_${i}`).value || '';
  }
  await saveData(`/api/${formType}`, formData, `${formType}-message`);
}

async function saveData(endpoint, formData, messageId) {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      showMessage(messageId, 'Saved Successfully!', 'success');
      loadAllStats(); // Reload all data
    } else {
      const result = await response.json();
      showMessage(messageId, result.error || 'Failed to save', 'error');
    }
  } catch (error) {
    showMessage(messageId, 'Network error', 'error');
  }
}

function showMessage(messageId, text, type) {
  const messageEl = document.getElementById(messageId);
  messageEl.textContent = text;
  messageEl.className = `form-message ${type}`;
  messageEl.style.display = 'block';
  
  setTimeout(() => {
    messageEl.style.display = 'none';
  }, 3000);
}
// ===== 5 NEW FORMS =====

// Helper: collect all inputs from a form by prefix
function collectFields(ids) {
  const data = {};
  ids.forEach(id => { const el = document.getElementById(id); if(el) data[id] = el.value.trim(); });
  return data;
}

// Helper: fill fields from data object
function fillFields(data) {
  Object.entries(data).forEach(([k,v]) => { const el = document.getElementById(k); if(el) el.value = v||''; });
}

// Helper: post JSON
async function postJSON(url, data) {
  const res = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
  return res.json();
}

// Helper: show message
function showMsg(id, text) {
  const el = document.getElementById(id);
  if(!el) return;
  el.textContent = text;
  el.style.color = '#10b981';
  setTimeout(() => el.textContent = '', 2500);
}

// ---- PERFORMANCE SUMMARY ----
const psFields = ['ps_impressions','ps_impressions_change','ps_revenue','ps_revenue_change','ps_ecpm','ps_ecpm_change','ps_app_1','ps_app_2','ps_app_3','ps_app_4','ps_app_5'];
document.getElementById('perfSummaryForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  await postJSON('/api/perf_summary', collectFields(psFields));
  showMsg('perfSummaryMessage', '✅ Saved!');
});

// ---- PRICING RULES ----
const prFields = ['pr_rule_name','pr_impressions','pr_revenue','pr_ecpm','pr_everything_impressions','pr_everything_revenue','pr_everything_ecpm','pr_est_revenue','pr_winning_bids'];
document.getElementById('pricingRulesForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  await postJSON('/api/pricing_rules', collectFields(prFields));
  showMsg('pricingRulesMessage', '✅ Saved!');
});

// ---- DEMAND COMPARISON ----
const dcFields = ['dc_c1_label','dc_c1_value','dc_c2_label','dc_c2_value','dc_c3_label','dc_c3_value','dc_c4_label','dc_c4_value','dc_c5_label','dc_c5_value'];
document.getElementById('demandComparisonForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  await postJSON('/api/demand_comparison', collectFields(dcFields));
  showMsg('demandComparisonMessage', '✅ Saved!');
});

// ---- TOP ADVERTISERS ----
const advFields = [];
for(let i=1;i<=5;i++) ['name','impressions','revenue','ecpm','viewability'].forEach(k => advFields.push(`adv${i}_${k}`));
document.getElementById('topAdvertisersForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  await postJSON('/api/top_advertisers', collectFields(advFields));
  showMsg('topAdvertisersMessage', '✅ Saved!');
});

// ---- YIELD PARTNERS ----
const ypFields = [];
for(let i=1;i<=3;i++) ['name','impressions','revenue','ecpm'].forEach(k => ypFields.push(`yp${i}_${k}`));
document.getElementById('yieldPartnersForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  await postJSON('/api/yield_partners', collectFields(ypFields));
  showMsg('yieldPartnersMessage', '✅ Saved!');
});

// ---- LOAD ALL ON PAGE LOAD ----
async function loadAllNewForms() {
  try {
    const res = await fetch('/stats');
    const d = await res.json();
    if(d.perf_summary) fillFields(d.perf_summary);
    if(d.pricing_rules) fillFields(d.pricing_rules);
    if(d.demand_comparison) fillFields(d.demand_comparison);
    if(d.top_advertisers) fillFields(d.top_advertisers);
    if(d.yield_partners) fillFields(d.yield_partners);
  } catch(e) { console.error('Load error:', e); }
}

document.addEventListener('DOMContentLoaded', loadAllNewForms);
