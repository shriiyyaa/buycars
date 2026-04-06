const db = require('../db/database');

exports.getAll = (req, res) => {
  const { min_price, max_price, color, max_mileage } = req.query;
  let query = 'SELECT * FROM marketplace_inventory WHERE 1=1';
  const params = [];

  if (min_price)  { query += ' AND asking_price >= ?'; params.push(min_price); }
  if (max_price)  { query += ' AND asking_price <= ?'; params.push(max_price); }
  if (color)      { query += ' AND color LIKE ?';      params.push(`%${color}%`); }
  if (max_mileage){ query += ' AND odometer_km <= ?';  params.push(max_mileage); }

  const rows = db.prepare(query).all(...params);
  res.json({ results: rows });
};

exports.addCar = (req, res) => {
  const { oem_spec_id, image_url, title, description, asking_price, color,
    odometer_km, major_scratches, original_paint, accidents_reported,
    previous_buyers, registration_place } = req.body;

  if (!title || !asking_price || !color || !odometer_km || !registration_place)
    return res.status(400).json({ error: 'Required fields missing' });

  const stmt = db.prepare(`INSERT INTO marketplace_inventory 
    (dealer_id, oem_spec_id, image_url, title, description, asking_price, color,
    odometer_km, major_scratches, original_paint, accidents_reported, previous_buyers, registration_place)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  const result = stmt.run(
    req.user.id, oem_spec_id || null, image_url || '', title, description || '',
    asking_price, color, odometer_km,
    major_scratches || 0, original_paint ?? 1,
    accidents_reported || 0, previous_buyers || 0, registration_place
  );
  res.status(201).json({ message: 'Car added successfully', id: result.lastInsertRowid });
};

exports.updateCar = (req, res) => {
  const { id } = req.params;
  const { title, description, asking_price, color, odometer_km,
    major_scratches, original_paint, accidents_reported, previous_buyers, registration_place } = req.body;

  const result = db.prepare(`UPDATE marketplace_inventory SET 
    title=?, description=?, asking_price=?, color=?, odometer_km=?,
    major_scratches=?, original_paint=?, accidents_reported=?,
    previous_buyers=?, registration_place=? WHERE id=? AND dealer_id=?`)
    .run(title, description, asking_price, color, odometer_km,
      major_scratches, original_paint, accidents_reported,
      previous_buyers, registration_place, id, req.user.id);

  if (result.changes === 0) return res.status(404).json({ error: 'Car not found or unauthorized' });
  res.json({ message: 'Car updated successfully' });
};

exports.deleteCars = (req, res) => {
  const { ids } = req.body;
  if (!ids || !ids.length) return res.status(400).json({ error: 'No IDs provided' });

  const placeholders = ids.map(() => '?').join(',');
  const result = db.prepare(
    `DELETE FROM marketplace_inventory WHERE id IN (${placeholders}) AND dealer_id = ?`
  ).run(...ids, req.user.id);

  res.json({ message: `${result.changes} car(s) deleted successfully` });
};