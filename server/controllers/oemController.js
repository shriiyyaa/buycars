const db = require('../db/database');

exports.getCount = (req, res) => {
  db.get(`SELECT COUNT(*) as total FROM oem_specs`, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ total_oem_models: row.total });
  });
};

exports.search = (req, res) => {
  const { brand, model, year } = req.query;

  let query = `SELECT * FROM oem_specs WHERE 1=1`;
  const params = [];

  if (brand) { query += ` AND brand LIKE ?`; params.push(`%${brand}%`); }
  if (model) { query += ` AND model LIKE ?`; params.push(`%${model}%`); }
  if (year)  { query += ` AND year = ?`;     params.push(year); }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ message: 'No OEM specs found' });
    res.json({ results: rows });
  });
};