async function getLatestRecord(Model, dateFilter, isGlobal = false) {
  try {
    let row;

    if (!isGlobal && dateFilter) {
      row = await Model.findOne({ date_filter: dateFilter }).sort({ id: -1 }).lean();
      if (!row) {
        row = await Model.findOne().sort({ id: -1 }).lean();
      }
    } else {
      row = await Model.findOne().sort({ id: -1 }).lean();
    }

    return row || null;
  } catch (error) {
    console.error(`Error fetching ${Model.modelName}:`, error);
    return null;
  }
}

module.exports = { getLatestRecord };
