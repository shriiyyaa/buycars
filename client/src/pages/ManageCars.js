import React, { useState, useEffect } from 'react';
import API from '../utils/api';

function ManageCars() {
  const [cars, setCars] = useState([]);
  const [selected, setSelected] = useState([]);
  const [filters, setFilters] = useState({ min_price: '', max_price: '', color: '', max_mileage: '' });
  const [editCar, setEditCar] = useState(null);
  const [message, setMessage] = useState('');

  const fetchCars = async () => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    const { data } = await API.get('/inventory', { params });
    setCars(data.results);
  };

  useEffect(() => { fetchCars(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleSelect = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const selectAll = (e) =>
    setSelected(e.target.checked ? cars.map(c => c.id) : []);

  const deleteSelected = async () => {
    if (!selected.length) return;
    if (!window.confirm(`Permanently delete ${selected.length} listing(s)?`)) return;
    await API.delete('/inventory', { data: { ids: selected } });
    setMessage(`${selected.length} listing(s) removed.`);
    setSelected([]);
    fetchCars();
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    // Ensure no negative values before saving
    const sanitized = {
      ...editCar,
      asking_price: Math.max(0, Number(editCar.asking_price)),
      odometer_km: Math.max(0, Number(editCar.odometer_km)),
      accidents_reported: Math.max(0, Number(editCar.accidents_reported)),
      previous_buyers: Math.max(0, Number(editCar.previous_buyers)),
    };
    await API.put(`/inventory/${editCar.id}`, sanitized);
    setMessage('Listing updated successfully.');
    setEditCar(null);
    fetchCars();
  };

  const ff = (field) => ({
    value: editCar?.[field] ?? '',
    min: ['asking_price','odometer_km','accidents_reported','previous_buyers'].includes(field) ? 0 : undefined,
    onChange: e => {
      let val = e.target.value;
      if (['asking_price','odometer_km','accidents_reported','previous_buyers'].includes(field)) {
        val = Math.max(0, parseInt(val) || 0);
      }
      setEditCar({ ...editCar, [field]: val });
    }
  });

  return (
    <div>
      <div className="page-header">
        <h1>My Listings</h1>
        <p>Manage your inventory, edit details, and remove listings</p>
      </div>

      <div className="filters-bar">
        {[['min_price', 'Min Price'], ['max_price', 'Max Price'], ['color', 'Color'], ['max_mileage', 'Max KM']].map(([key, label]) => (
          <div className="filter-field" key={key}>
            <label>{label}</label>
            <input
              type={key === 'color' ? 'text' : 'number'}
              min="0"
              placeholder={label}
              value={filters[key]}
              onChange={e => setFilters({ ...filters, [key]: e.target.value })}
            />
          </div>
        ))}
        <button className="btn-filter" onClick={fetchCars}>Filter</button>
        <button className="btn-reset-sm"
          onClick={() => { setFilters({ min_price: '', max_price: '', color: '', max_mileage: '' }); fetchCars(); }}>
          Reset
        </button>
      </div>

      {message && <div className="success-msg" style={{ marginBottom: '14px' }}>{message}</div>}

      <div className="manage-header">
        <h2>Listings <span className="badge">{cars.length}</span></h2>
        {selected.length > 0 && (
          <button className="btn-delete-bulk" onClick={deleteSelected}>
            Delete {selected.length} selected
          </button>
        )}
      </div>

      <div className="table-card">
        {cars.length === 0 ? (
          <div className="empty-state">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ color: 'var(--text-3)', display: 'block', margin: '0 auto' }}>
              <path d="M5.5 11L7.5 6.5C7.8 5.6 8.65 5 9.6 5H14.4C15.35 5 16.2 5.6 16.5 6.5L18.5 11"/>
              <rect x="3" y="11" width="18" height="7" rx="2"/>
              <circle cx="7.5" cy="18" r="1.5"/>
              <circle cx="16.5" cy="18" r="1.5"/>
            </svg>
            <h3>No listings yet</h3>
            <p>Use <a href="/add-car">Add Car</a> in the navbar to list your first vehicle</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" onChange={selectAll} checked={selected.length === cars.length && cars.length > 0} /></th>
                <th>Photo</th>
                <th>Title</th>
                <th>Price</th>
                <th>Color</th>
                <th>Odometer</th>
                <th>City</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map(car => {
                const accidents = Math.max(0, Number(car.accidents_reported));
                return (
                  <tr key={car.id}>
                    <td><input type="checkbox" checked={selected.includes(car.id)} onChange={() => toggleSelect(car.id)} /></td>
                    <td>
                      {car.image_url
                        ? <img className="car-thumb" src={car.image_url} alt={car.title} onError={e => e.target.style.display = 'none'} />
                        : <div className="car-thumb-placeholder">—</div>}
                    </td>
                    <td className="car-title-cell">
                      <strong>{car.title}</strong>
                      <span>{car.registration_place} · {Math.max(0, Number(car.previous_buyers))} prev. owner(s)</span>
                    </td>
                    <td><span className="price-tag">₹{Number(car.asking_price).toLocaleString('en-IN')}</span></td>
                    <td><span className="km-tag">{car.color}</span></td>
                    <td><span className="km-tag">{Number(car.odometer_km).toLocaleString('en-IN')} km</span></td>
                    <td><span className="city-tag">{car.registration_place}</span></td>
                    <td>
                      {accidents === 0
                        ? <span className="status-ok">Clean</span>
                        : <span className="status-warn">{accidents} accident(s)</span>}
                    </td>
                    <td><button className="btn-edit-sm" onClick={() => setEditCar({ ...car, accidents_reported: Math.max(0, Number(car.accidents_reported)) })}>Edit</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {editCar && (
        <div className="modal-backdrop" onClick={() => setEditCar(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>Edit Listing</h3>
            <form onSubmit={saveEdit}>
              <div className="form-field"><label>Title</label><input type="text" {...ff('title')} /></div>
              <div className="form-grid-2">
                <div className="form-field"><label>Asking Price (INR)</label><input type="number" {...ff('asking_price')} /></div>
                <div className="form-field"><label>Color</label><input type="text" {...ff('color')} /></div>
                <div className="form-field"><label>Odometer (KM)</label><input type="number" {...ff('odometer_km')} /></div>
                <div className="form-field"><label>Registration City</label><input type="text" {...ff('registration_place')} /></div>
                <div className="form-field"><label>Accidents Reported</label><input type="number" {...ff('accidents_reported')} /></div>
                <div className="form-field"><label>Previous Owners</label><input type="number" {...ff('previous_buyers')} /></div>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-save">Save Changes</button>
                <button type="button" className="btn-cancel" onClick={() => setEditCar(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageCars;