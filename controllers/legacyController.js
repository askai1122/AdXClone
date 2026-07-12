const { modelMap } = require('../models');

const LEGACY_FORMS = [
  'transactionform',
  'settingsform',
  'payment_page',
  'how_you_get_paid',
  'last_payment_section',
];

async function saveDataLegacy(req, res) {
  try {
    const { formId, formData } = req.body;
    if (!formId || !formData) {
      return res.json({ success: true, message: 'Saved (legacy)' });
    }

    const fields = Object.keys(formData);
    if (fields.length === 0) {
      return res.json({ success: true, message: 'Saved (legacy)' });
    }

    const Model = modelMap[formId];
    if (!Model) {
      return res.json({ success: true, message: 'Saved (legacy)' });
    }

    const data = {};
    fields.forEach((field) => {
      data[field] = formData[field] || '';
    });

    await Model.create(data);
    res.json({ success: true, message: 'Saved!' });
  } catch (error) {
    res.json({ success: true, message: 'Saved (legacy)' });
  }
}

async function getDataLegacy(req, res) {
  try {
    const result = {};

    await Promise.all(
      LEGACY_FORMS.map(async (tableName) => {
        const Model = modelMap[tableName];
        const row = await Model.findOne().sort({ id: -1 }).lean();
        result[tableName] = row || {};
      })
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  saveDataLegacy,
  getDataLegacy,
};
