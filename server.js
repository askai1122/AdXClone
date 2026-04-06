const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

// ===== AUTH CONFIG =====
const ADMIN_USERNAME = 'admin';
// Password: ADX@Secure#2025! (SHA-256 hashed)
const ADMIN_PASSWORD_HASH = crypto.createHash('sha256').update('ADX@Secure#2025!').digest('hex');

// In-memory session store (token -> expiry)
const sessions = new Map();

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function isValidSession(token) {
  if (!token || !sessions.has(token)) return false;
  const expiry = sessions.get(token);
  if (Date.now() > expiry) { sessions.delete(token); return false; }
  return true;
}

// Auth middleware for /admin API routes
function requireAuth(req, res, next) {
  const token = req.headers['x-admin-token'] || req.query._token;
  if (isValidSession(token)) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

app.use(express.json());
app.use(cors());

// ===== PUBLIC STATIC FILES (no auth) =====
// Serve: adx_dashboard.html, payment.html, payment_details.html, assets/
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/adx_dashboard.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public/adx_dashboard.html')));
app.get('/payment', (req, res) => res.sendFile(path.join(__dirname, 'public/payment.html')));
app.get('/payment-details', (req, res) => res.sendFile(path.join(__dirname, 'public/payment_details.html')));
app.get('/kk.html', (req, res) => res.sendFile(path.join(__dirname, 'public/kk.html')));
app.get('/sites', (req, res) => res.sendFile(path.join(__dirname, 'public/sitepage.html')));
app.get('/mcm', (req, res) => res.sendFile(path.join(__dirname, 'public/mcm.html')));
// ===== LOGIN ENDPOINT =====
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body || {};
  const passHash = crypto.createHash('sha256').update(password || '').digest('hex');
  if (username === ADMIN_USERNAME && passHash === ADMIN_PASSWORD_HASH) {
    const token = generateToken();
    sessions.set(token, Date.now() + 8 * 60 * 60 * 1000); // 8 hours
    return res.json({ success: true, token });
  }
  return res.status(401).json({ success: false, message: 'Invalid username or password.' });
});

app.post('/admin/logout', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (token) sessions.delete(token);
  res.json({ success: true });
});

// ===== ADMIN STATIC PAGES (serve directly, auth enforced client-side + sessionStorage) =====
app.get('/admin/login', (req, res) => res.sendFile(path.join(__dirname, 'public/admin/login.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public/admin/index.html')));
app.get('/admin/', (req, res) => res.sendFile(path.join(__dirname, 'public/admin/index.html')));
app.get('/admin/index.html', (req, res) => res.sendFile(path.join(__dirname, 'public/admin/index.html')));
app.get('/admin/payments', (req, res) => res.sendFile(path.join(__dirname, 'public/admin/paymentpage.html')));
app.get('/admin/paymentpage.html', (req, res) => res.sendFile(path.join(__dirname, 'public/admin/paymentpage.html')));

app.get('/admin/transactions', (req, res) => res.sendFile(path.join(__dirname, 'public/admin/transactionpage.html')));
app.get('/admin/transactionpage.html', (req, res) => res.sendFile(path.join(__dirname, 'public/admin/transactionpage.html')));
app.get('/admin/receipts', (req, res) => res.sendFile(path.join(__dirname, 'public/admin/reciptpage.html')));
app.get('/admin/reciptpage.html', (req, res) => res.sendFile(path.join(__dirname, 'public/admin/reciptpage.html')));
app.use('/admin/assets', express.static(path.join(__dirname, 'public/assets')));

// Keep serving old public pages for backward compat (direct file access)
app.use(express.static('public'));

const db = new sqlite3.Database('overview_data.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS overview_form (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      network_id TEXT,
      impressions TEXT,
      impressions_percent TEXT,
      revenue TEXT,
      revenue_percent TEXT,
      ecpm TEXT,
      ecpm_percent TEXT,
      viewability TEXT,
      viewability_percent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  // Add columns if they don't exist (migration for existing DBs)
  ['ecpm','ecpm_percent','viewability','viewability_percent'].forEach(col => {
    db.run(`ALTER TABLE overview_form ADD COLUMN ${col} TEXT`, () => {});
  });
  // Migration: ensure clicks table has clicks_graph_numbers column
  db.run(`ALTER TABLE overview_form ADD COLUMN network_id TEXT`, () => {});
  db.run(`ALTER TABLE clicks ADD COLUMN clicks_graph_numbers TEXT`, () => {});
  db.run(`ALTER TABLE ecpm ADD COLUMN ecpm_graph_numbers TEXT`, () => {});
  db.run(`ALTER TABLE impressions ADD COLUMN impressions_graph_numbers TEXT`, () => {});
  // Migration: ensure settingsform has all needed columns
  db.run(`ALTER TABLE settingsform ADD COLUMN network_id TEXT`, () => {});
  db.run(`ALTER TABLE settingsform ADD COLUMN site_name TEXT`, () => {});
  db.run(`ALTER TABLE settingsform ADD COLUMN mcm_parent_url TEXT`, () => {});
  db.run(`ALTER TABLE settingsform ADD COLUMN mcm_network_code TEXT`, () => {});

  db.run(`
    CREATE TABLE IF NOT EXISTS clicks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clicks_total TEXT,
      clicks_country_name_1 TEXT,
      clicks_country_name_2 TEXT,
      clicks_country_name_3 TEXT,
      clicks_country_name_4 TEXT,
      clicks_country_name_5 TEXT,
      clicks_country_name_6 TEXT,
      clicks_graph_numbers TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS ecpm (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ecpm_total TEXT,
      ecpm_country_name_1 TEXT,
      ecpm_country_name_2 TEXT,
      ecpm_country_name_3 TEXT,
      ecpm_country_name_4 TEXT,
      ecpm_country_name_5 TEXT,
      ecpm_country_name_6 TEXT,
      ecpm_graph_numbers TEXT,

      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS impressions_country (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      impressions_total TEXT,
      impressions_country_name_1 TEXT,
      impressions_country_name_2 TEXT,
      impressions_country_name_3 TEXT,
      impressions_country_name_4 TEXT,
      impressions_country_name_5 TEXT,
      impressions_country_name_6 TEXT,
      impressions_graph_numbers TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Performance Summary
  db.run(`CREATE TABLE IF NOT EXISTS perf_summary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ps_impressions TEXT, ps_impressions_change TEXT,
    ps_revenue TEXT, ps_revenue_change TEXT,
    ps_ecpm TEXT, ps_ecpm_change TEXT,
    ps_app_1 TEXT, ps_app_2 TEXT, ps_app_3 TEXT, ps_app_4 TEXT, ps_app_5 TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Top Pricing Rules
  db.run(`CREATE TABLE IF NOT EXISTS pricing_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pr_rule_name TEXT, pr_impressions TEXT, pr_revenue TEXT, pr_ecpm TEXT,
    pr_everything_impressions TEXT, pr_everything_revenue TEXT, pr_everything_ecpm TEXT,
    pr_est_revenue TEXT, pr_winning_bids TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Demand Comparison
  db.run(`CREATE TABLE IF NOT EXISTS demand_comparison (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dc_c1_label TEXT, dc_c1_value TEXT,
    dc_c2_label TEXT, dc_c2_value TEXT,
    dc_c3_label TEXT, dc_c3_value TEXT,
    dc_c4_label TEXT, dc_c4_value TEXT,
    dc_c5_label TEXT, dc_c5_value TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Top Advertisers
  db.run(`CREATE TABLE IF NOT EXISTS top_advertisers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    adv1_name TEXT, adv1_impressions TEXT, adv1_revenue TEXT, adv1_ecpm TEXT, adv1_viewability TEXT,
    adv2_name TEXT, adv2_impressions TEXT, adv2_revenue TEXT, adv2_ecpm TEXT, adv2_viewability TEXT,
    adv3_name TEXT, adv3_impressions TEXT, adv3_revenue TEXT, adv3_ecpm TEXT, adv3_viewability TEXT,
    adv4_name TEXT, adv4_impressions TEXT, adv4_revenue TEXT, adv4_ecpm TEXT, adv4_viewability TEXT,
    adv5_name TEXT, adv5_impressions TEXT, adv5_revenue TEXT, adv5_ecpm TEXT, adv5_viewability TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Yield Partners
  db.run(`CREATE TABLE IF NOT EXISTS yield_partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    yp1_name TEXT, yp1_impressions TEXT, yp1_revenue TEXT, yp1_ecpm TEXT,
    yp2_name TEXT, yp2_impressions TEXT, yp2_revenue TEXT, yp2_ecpm TEXT,
    yp3_name TEXT, yp3_impressions TEXT, yp3_revenue TEXT, yp3_ecpm TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// SAVE Endpoints — protected by auth
app.post('/api/overview', requireAuth, (req, res) => {
  const { network_id,impressions, impressions_percent, revenue, revenue_percent,
          ecpm, ecpm_percent, viewability, viewability_percent, date_filter } = req.body;
  const df = date_filter || 'today';
  const stmt = db.prepare(`
    INSERT INTO overview_form (network_id,impressions, impressions_percent, revenue, revenue_percent, ecpm, ecpm_percent, viewability, viewability_percent, date_filter)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)
  `);
  stmt.run(network_id || '',impressions||'', impressions_percent||'', revenue||'', revenue_percent||'',
           ecpm||'', ecpm_percent||'', viewability||'', viewability_percent||'', df, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to save overview' });
    res.json({ success: true });
  });
  stmt.finalize();
});

app.post('/api/clicks', requireAuth, (req, res) => {
  const { clicks_total, clicks_country_name_1, clicks_country_name_2, clicks_country_name_3,
          clicks_country_name_4, clicks_country_name_5, clicks_country_name_6, clicks_graph_numbers, date_filter } = req.body;
  const df = date_filter || 'today';
  const stmt = db.prepare(`
    INSERT INTO clicks (clicks_total, clicks_country_name_1, clicks_country_name_2, clicks_country_name_3,
                       clicks_country_name_4, clicks_country_name_5, clicks_country_name_6, clicks_graph_numbers, date_filter)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(clicks_total || '', clicks_country_name_1 || '', clicks_country_name_2 || '', clicks_country_name_3 || '',
           clicks_country_name_4 || '', clicks_country_name_5 || '', clicks_country_name_6 || '', clicks_graph_numbers || '', df, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to save clicks' });
    res.json({ success: true });
  });
  stmt.finalize();
});
  // stmt.run(clicks_total || '', clicks_country_name_1 || '', clicks_country_name_2 || '', clicks_country_name_3 || '',
  //          clicks_country_name_4 || '', clicks_country_name_5 || '', clicks_country_name_6 || '', clicks_graph_numbers || '', (err) => {
  //   if (err) return res.status(500).json({ error: 'Failed to save clicks' });
  //   res.json({ success: true });
  // });
  // stmt.finalize();


app.post('/api/ecpm', requireAuth, (req, res) => {
  const { ecpm_total, ecpm_country_name_1, ecpm_country_name_2, ecpm_country_name_3,
          ecpm_country_name_4, ecpm_country_name_5, ecpm_country_name_6, ecpm_graph_numbers, date_filter } = req.body;
  const df = date_filter || 'today';
  const stmt = db.prepare(`
    INSERT INTO ecpm (ecpm_total, ecpm_country_name_1, ecpm_country_name_2, ecpm_country_name_3,
                      ecpm_country_name_4, ecpm_country_name_5, ecpm_country_name_6, ecpm_graph_numbers, date_filter)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(ecpm_total || '', ecpm_country_name_1 || '', ecpm_country_name_2 || '', ecpm_country_name_3 || '',
           ecpm_country_name_4 || '', ecpm_country_name_5 || '', ecpm_country_name_6 || '', ecpm_graph_numbers || '', df, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to save eCPM' });
    res.json({ success: true });
  });
  stmt.finalize();
});

app.post('/api/impressions', requireAuth, (req, res) => {
  const { impressions_total, impressions_country_name_1, impressions_country_name_2, impressions_country_name_3,
          impressions_country_name_4, impressions_country_name_5, impressions_country_name_6, impressions_graph_numbers, date_filter } = req.body;
  const df = date_filter || 'today';
  const stmt = db.prepare(`
    INSERT INTO impressions_country (impressions_total, impressions_country_name_1, impressions_country_name_2, impressions_country_name_3,
                                    impressions_country_name_4, impressions_country_name_5, impressions_country_name_6, impressions_graph_numbers, date_filter)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(impressions_total || '', impressions_country_name_1 || '', impressions_country_name_2 || '', impressions_country_name_3 || '',
           impressions_country_name_4 || '', impressions_country_name_5 || '', impressions_country_name_6 || '', impressions_graph_numbers || '', df, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to save impressions' });
    res.json({ success: true });
  });
  stmt.finalize();
});

// ===== NEW SAVE ENDPOINTS =====

app.post('/api/perf_summary', requireAuth, (req, res) => {
  const f = req.body;
  const df = f.date_filter || 'today';
  db.run(`INSERT INTO perf_summary (ps_impressions,ps_impressions_change,ps_revenue,ps_revenue_change,ps_ecpm,ps_ecpm_change,ps_app_1,ps_app_2,ps_app_3,ps_app_4,ps_app_5,date_filter) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    [f.ps_impressions||'',f.ps_impressions_change||'',f.ps_revenue||'',f.ps_revenue_change||'',f.ps_ecpm||'',f.ps_ecpm_change||'',f.ps_app_1||'',f.ps_app_2||'',f.ps_app_3||'',f.ps_app_4||'',f.ps_app_5||'',df],
    err => err ? res.status(500).json({error:'Failed'}) : res.json({success:true}));
});

app.post('/api/pricing_rules', requireAuth, (req, res) => {
  const f = req.body;
  const df = f.date_filter || 'today';
  db.run(`INSERT INTO pricing_rules (pr_rule_name,pr_impressions,pr_revenue,pr_ecpm,pr_everything_impressions,pr_everything_revenue,pr_everything_ecpm,pr_est_revenue,pr_winning_bids,date_filter) VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [f.pr_rule_name||'',f.pr_impressions||'',f.pr_revenue||'',f.pr_ecpm||'',f.pr_everything_impressions||'',f.pr_everything_revenue||'',f.pr_everything_ecpm||'',f.pr_est_revenue||'',f.pr_winning_bids||'',df],
    err => err ? res.status(500).json({error:'Failed'}) : res.json({success:true}));
});

app.post('/api/demand_comparison', requireAuth, (req, res) => {
  const f = req.body;
  const df = f.date_filter || 'today';
  db.run(`INSERT INTO demand_comparison (dc_c1_label,dc_c1_value,dc_c2_label,dc_c2_value,dc_c3_label,dc_c3_value,dc_c4_label,dc_c4_value,dc_c5_label,dc_c5_value,date_filter) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
    [f.dc_c1_label||'',f.dc_c1_value||'',f.dc_c2_label||'',f.dc_c2_value||'',f.dc_c3_label||'',f.dc_c3_value||'',f.dc_c4_label||'',f.dc_c4_value||'',f.dc_c5_label||'',f.dc_c5_value||'',df],
    err => err ? res.status(500).json({error:'Failed'}) : res.json({success:true}));
});

app.post('/api/top_advertisers', requireAuth, (req, res) => {
  const f = req.body;
  const df = f.date_filter || 'today';
  const cols = [];
  const vals = [];
  for(let i=1;i<=5;i++) {
    ['name','impressions','revenue','ecpm','viewability'].forEach(k => {
      cols.push(`adv${i}_${k}`); vals.push(f[`adv${i}_${k}`]||'');
    });
  }
  cols.push('date_filter'); vals.push(df);
  db.run(`INSERT INTO top_advertisers (${cols.join(',')}) VALUES (${cols.map(()=>'?').join(',')})`, vals,
    err => err ? res.status(500).json({error:'Failed'}) : res.json({success:true}));
});

app.post('/api/yield_partners', requireAuth, (req, res) => {
  const f = req.body;
  const df = f.date_filter || 'today';
  db.run(`INSERT INTO yield_partners (yp1_name,yp1_impressions,yp1_revenue,yp1_ecpm,yp2_name,yp2_impressions,yp2_revenue,yp2_ecpm,yp3_name,yp3_impressions,yp3_revenue,yp3_ecpm,date_filter) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [f.yp1_name||'',f.yp1_impressions||'',f.yp1_revenue||'',f.yp1_ecpm||'',f.yp2_name||'',f.yp2_impressions||'',f.yp2_revenue||'',f.yp2_ecpm||'',f.yp3_name||'',f.yp3_impressions||'',f.yp3_revenue||'',f.yp3_ecpm||'',df],
    err => err ? res.status(500).json({error:'Failed'}) : res.json({success:true}));
});

// ✅ FIXED /stats - Separate queries for each table (NO UNION ERROR)
app.get('/stats', (req, res) => {
  // Accept date_filter from query param; default to 'last_30_days' for dashboard
  const dateFilter = req.query.date_filter || 'last_30_days';

  const result = {
    overview_form: {},
    clicks: {},
    ecpm: {},
    impressions_country: {},
    active_date_filter: dateFilter
  };

  // Helper function to get latest record for a given date_filter
  const getLatest = (table, callback) => {
    db.get(
      `SELECT * FROM ${table} WHERE date_filter = ? ORDER BY id DESC LIMIT 1`,
      [dateFilter],
      (err, row) => {
        if (err) {
          console.error(`Error fetching ${table}:`, err);
          // fallback: latest record regardless of filter
          db.get(`SELECT * FROM ${table} ORDER BY id DESC LIMIT 1`, (err2, row2) => {
            callback(err2 ? null : row2);
          });
        } else if (!row) {
          // No row for this filter, fallback to latest any
          db.get(`SELECT * FROM ${table} ORDER BY id DESC LIMIT 1`, (err2, row2) => {
            callback(err2 ? null : row2);
          });
        } else {
          callback(row);
        }
      }
    );
  };

  // Fetch overview
  getLatest('overview_form', (row) => {
    if (row) {
      result.overview_form = {
        network_id: row.network_id,
        impressions: row.impressions,
        impressions_percent: row.impressions_percent,
        revenue: row.revenue,
        revenue_percent: row.revenue_percent,
        ecpm: row.ecpm,
        ecpm_percent: row.ecpm_percent,
        viewability: row.viewability,
        viewability_percent: row.viewability_percent
      };
    }
  });

  // Fetch clicks
  getLatest('clicks', (row) => {
    if (row) {
      result.clicks = {
        clicks_total: row.clicks_total,
        clicks_country_name_1: row.clicks_country_name_1,
        clicks_country_name_2: row.clicks_country_name_2,
        clicks_country_name_3: row.clicks_country_name_3,
        clicks_country_name_4: row.clicks_country_name_4,
        clicks_country_name_5: row.clicks_country_name_5,
        clicks_country_name_6: row.clicks_country_name_6,
        clicks_graph_numbers:  row.clicks_graph_numbers
      };
    }
  });

  // Fetch eCPM
  getLatest('ecpm', (row) => {
    if (row) {
      result.ecpm = {
        ecpm_total: row.ecpm_total,
        ecpm_country_name_1: row.ecpm_country_name_1,
        ecpm_country_name_2: row.ecpm_country_name_2,
        ecpm_country_name_3: row.ecpm_country_name_3,
        ecpm_country_name_4: row.ecpm_country_name_4,
        ecpm_country_name_5: row.ecpm_country_name_5,
        ecpm_country_name_6: row.ecpm_country_name_6,
        ecpm_graph_numbers:  row.ecpm__graph_numbers || row.ecpm_graph_numbers
      };
    }
  });

  // Fetch impressions_country
  getLatest('impressions_country', (row) => {
    if (row) {
      result.impressions_country = {
        impressions_total: row.impressions_total,
        impressions_country_name_1: row.impressions_country_name_1,
        impressions_country_name_2: row.impressions_country_name_2,
        impressions_country_name_3: row.impressions_country_name_3,
        impressions_country_name_4: row.impressions_country_name_4,
        impressions_country_name_5: row.impressions_country_name_5,
        impressions_country_name_6: row.impressions_country_name_6,
        impressions_graph_numbers:  row.impressions__graph_numbers || row.impressions_graph_numbers
      };
    }
    
    // Fetch new tables (filtered by date_filter, except settingsform which is global)
    const extraTables = ['payment_page','transactionform','settingsform','currentmonthtrans','lastmonthtrans','thirdmonthtrans','reciptform','secondmonthreciptform','thirdmonthreciptform','perf_summary','pricing_rules','demand_comparison','top_advertisers','yield_partners'];
    const globalTables = ['settingsform']; // these are not date-filtered
    let fetched = 0;
    if (extraTables.length === 0) { res.json(result); return; }
    extraTables.forEach(t => {
      if (globalTables.includes(t)) {
        // Always fetch latest for global tables
        db.get(`SELECT * FROM ${t} ORDER BY id DESC LIMIT 1`, (err, row) => {
          result[t] = row || {};
          fetched++;
          if (fetched === extraTables.length) setTimeout(() => res.json(result), 10);
        });
      } else {
        db.get(`SELECT * FROM ${t} WHERE date_filter = ? ORDER BY id DESC LIMIT 1`, [dateFilter], (err, row) => {
          if (!row && !err) {
            // fallback to latest any
            db.get(`SELECT * FROM ${t} ORDER BY id DESC LIMIT 1`, (err2, row2) => {
              result[t] = row2 || {};
              fetched++;
              if (fetched === extraTables.length) setTimeout(() => res.json(result), 10);
            });
          } else {
            result[t] = row || {};
            fetched++;
            if (fetched === extraTables.length) setTimeout(() => res.json(result), 10);
          }
        });
      }
    });
  });
});

// ===== NEW TABLES =====
const newTables = {
  payment_page:          `id INTEGER PRIMARY KEY AUTOINCREMENT, earnings TEXT, lastpaymentdate TEXT, bankaccountname TEXT, lastthreedigits TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP`,
  transactionform:       `id INTEGER PRIMARY KEY AUTOINCREMENT, firstmonth TEXT, firstmonthdate TEXT, secondmonth TEXT, secondmonthdate TEXT, thirdmonth TEXT, thirdmonthdate TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP`,
  settingsform:          `id INTEGER PRIMARY KEY AUTOINCREMENT, publisherid TEXT, publishername TEXT, publisheruser TEXT, network_id TEXT, site_name TEXT, mcm_parent_url TEXT, mcm_network_code TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP`,
  currentmonthtrans:     `id INTEGER PRIMARY KEY AUTOINCREMENT, startingbalance TEXT, endingbalance TEXT, firstmonthreciptdate TEXT, banknumber TEXT, amount TEXT, firstmonthtitledate TEXT, firstmonthtitle TEXT, firstmonthtitleamount TEXT, firstmonthinvaliddate TEXT, firstmonthinvalidtitle TEXT, firstmonthinvalidamount TEXT, firstmonthextrainvaliddate TEXT, firstmonthextrainvalidtitle TEXT, firstmonthextrainvalidamount TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP`,
  lastmonthtrans:        `id INTEGER PRIMARY KEY AUTOINCREMENT, secondmonthstartingbalance TEXT, secondmonthendingbalance TEXT, secondmonthreciptdate TEXT, secondmonthbanknumber TEXT, secondmonthamount TEXT, secondmonthtitledate TEXT, secondmonthtitle TEXT, secondmonthtitleamount TEXT, secondmonthinvaliddate TEXT, secondmonthinvalidtitle TEXT, secondmonthinvalidamount TEXT, secondmonthextrainvaliddate TEXT, secondmonthextrainvalidtitle TEXT, secondmonthextrainvalidamount TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP`,
  thirdmonthtrans:       `id INTEGER PRIMARY KEY AUTOINCREMENT, thirdmonthstartingbalance TEXT, thirdmonthendingbalance TEXT, thirdmonthreciptdate TEXT, thirdmonthbanknumber TEXT, thirdmonthamount TEXT, thirdmonthtitledate TEXT, thirdmonthtitle TEXT, thirdmonthtitleamount TEXT, thirdmonthinvaliddate TEXT, thirdmonthinvalidtitle TEXT, thirdmonthinvalidamount TEXT, thirdmonthextrainvaliddate TEXT, thirdmonthextrainvalidtitle TEXT, thirdmonthextrainvalidamount TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP`,
  reciptform:            `id INTEGER PRIMARY KEY AUTOINCREMENT, paymentdate TEXT, billingid TEXT, taxidentification TEXT, paymentmethod TEXT, paymentnumber TEXT, Amount TEXT, address TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP`,
  secondmonthreciptform: `id INTEGER PRIMARY KEY AUTOINCREMENT, paymentdate TEXT, billingid TEXT, taxidentification TEXT, paymentmethod TEXT, paymentnumber TEXT, Amount TEXT, address TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP`,
  thirdmonthreciptform:  `id INTEGER PRIMARY KEY AUTOINCREMENT, paymentdate TEXT, billingid TEXT, taxidentification TEXT, paymentmethod TEXT, paymentnumber TEXT, Amount TEXT, address TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP`,
};

Object.entries(newTables).forEach(([name, cols]) => {
  db.run(`CREATE TABLE IF NOT EXISTS ${name} (${cols})`);
});

// Generic save endpoint for new tables
function makeEndpoint(tableName) {
  app.post(`/api/${tableName}`, (req, res) => {
    const body = req.body;
    // Ensure date_filter is always present; default to 'today'
    if (!body.date_filter) body.date_filter = 'today';
    const fields = Object.keys(body);
    const values = fields.map(f => body[f] || '');
    if (fields.length === 0) return res.json({ success: true });
    db.run(
      `INSERT INTO ${tableName} (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`,
      values,
      err => err ? res.status(500).json({ error: err.message }) : res.json({ success: true })
    );
  });
}

Object.keys(newTables).forEach(makeEndpoint);

// Legacy endpoint for paymentpage/transactionpage/reciptpage old fetch calls
app.post('/api/save-data-legacy', requireAuth, (req, res) => res.json({ success: true, message: 'Saved (legacy)' }));
app.get('/api/get-data-legacy', (req, res) => res.json({}));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 All 4 forms data: http://localhost:${PORT}/stats`);
});