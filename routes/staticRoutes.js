const express = require('express');
const path = require('path');
const { getStats } = require('../controllers/statsController');

function registerStaticRoutes(app) {
  app.use('/assets', express.static(path.join(__dirname, '..', 'public', 'assets')));
  app.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'adx_dashboard.html')));
  app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'adx_dashboard.html')));
  app.get('/payment', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'payment.html')));
  app.get('/payment-details', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'payment_details.html')));
  app.get('/kk.html', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'kk.html')));
  app.get('/sites', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'sitepage.html')));
  app.get('/mcm', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'mcm.html')));

  app.get('/admin/login', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'login.html')));
  app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'index.html')));
  app.get('/admin/', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'index.html')));
  app.get('/admin/index.html', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'index.html')));
  app.get('/admin/payments', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'paymentpage.html')));
  app.get('/admin/paymentpage.html', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'paymentpage.html')));
  app.get('/admin/transactions', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'transactionpage.html')));
  app.get('/admin/transactionpage.html', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'transactionpage.html')));
  app.get('/admin/receipts', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'reciptpage.html')));
  app.get('/admin/reciptpage.html', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'reciptpage.html')));
  app.use('/admin/assets', express.static(path.join(__dirname, '..', 'public', 'assets')));

  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.get('/stats', getStats);
}

module.exports = registerStaticRoutes;
