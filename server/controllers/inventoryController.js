const db = require('../db/database');

exports.getAll = (req, res) => {
  const { min_price, max_price, color, max_mileage } = req.query;
  let query = `SELECT * FROM marketplace_inventory WHERE 1=1`;
  const params = [];

  if (min_price) { query += ` AND asking_price >= ?`; params.push(min_price); }
  if (max_price) { query += ` AND asking_price <= ?`; params.push(max_price); }
  if (color)     { query += ` AND color LIKE ?`;      params.push(`%${color}%`); }
  if (max_mileage) { query += ` AND odometer_km <= ?`; params.push(max_mileage); }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ results: rows });
  });
};

exports.addCar = (req, res) => {
  const { oem_spec_id, image_url, title, description, asking_price, color,
    odometer_km, major_scratches, original_paint, accidents_reported,
    previous_buyers, registration_place } = req.body;

  if (!title || !asking_price || !color || !odometer_km || !registration_place)
    return res.status(400).json({ error: 'Required fields missing' });

  db.run(
    `INSERT INTO marketplace_inventory 
    (dealer_id, oem_spec_id, image_url, title, description, asking_price, color,
    odometer_km, major_scratches, original_paint, accidents_reported, previous_buyers, registration_place)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [req.user.id, oem_spec_id, image_url, title, description, asking_price, color,
     odometer_km, major_scratches || 0, original_paint ?? 1, accidents_reported || 0,
     previous_buyers || 0, registration_place],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Car added successfully', id: this.lastID });
    }
  );
};

exports.updateCar = (req, res) => {
  const { id } = req.params;
  const { title, description, asking_price, color, odometer_km,
    major_scratches, original_paint, accidents_reported, previous_buyers, registration_place } = req.body;

  db.run(
    `UPDATE marketplace_inventory SET title=?, description=?, asking_price=?, color=?,
    odometer_km=?, major_scratches=?, original_paint=?, accidents_reported=?,
    previous_buyers=?, registration_place=? WHERE id=? AND dealer_id=?`,
    [title, description, asking_price, color, odometer_km, major_scratches,
     original_paint, accidents_reported, previous_buyers, registration_place, id, req.user.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Car not found or unauthorized' });
      res.json({ message: 'Car updated successfully' });
    }
  );
};

exports.deleteCars = (req, res) => {
  const { ids } = req.body;
  if (!ids || !ids.length) return res.status(400).json({ error: 'No IDs provided' });

  const placeholders = ids.map(() => '?').join(',');
  db.run(
    `DELETE FROM marketplace_inventory WHERE id IN (${placeholders}) AND dealer_id = ?`,
    [...ids, req.user.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: `${this.changes} car(s) deleted successfully` });
    }
  );
};