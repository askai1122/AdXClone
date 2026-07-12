require('dotenv').config();
const express = require('express');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');
const apiRoutes = require('./routes/apiRoutes');
const registerStaticRoutes = require('./routes/staticRoutes');

const app = express();

app.use(express.json());
app.use(cors());

registerStaticRoutes(app);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);

module.exports = app;
