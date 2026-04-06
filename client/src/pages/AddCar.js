import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const CAR_ANGLES = [
  { key: 'front', label: 'Front View', hint: 'Face-on shot showing grille and headlights' },
  { key: 'rear', label: 'Rear View', hint: 'Boot, tail lights, and rear bumper' },
  { key: 'driver_side', label: "Driver's Side", hint: 'Full left profile of the car' },
  { key: 'passenger_side', label: "Passenger's Side", hint: 'Full right profile of the car' },
  { key: 'interior', label: 'Interior / Dashboard', hint: 'Steering wheel, dashboard, and seats' },
  { key: 'odometer', label: 'Odometer Reading', hint: 'Close-up of the instrument cluster' },
];

function ImageUploadSlot({ angle, value, onChange }) {
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(angle.key, ev.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div className="img-slot">
      <div className={`upload-zone-sm ${value ? 'has-image' : ''}`}>
        <input type="file" accept="image/*" onChange={handleChange} />
        {value ? (
          <img src={value} alt={angle.label} />
        ) : (
          <div className="upload-placeholder-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--text-3)' }}>
              <rect x="3" y="3" width="18" height="18" rx="3"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
            <span>Upload</span>
          </div>
        )}
      </div>
      <div className="img-slot-label">{angle.label}</div>
      <div className="img-slot-hint">{angle.hint}</div>
    </div>
  );
}

function AddCar() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', asking_price: '', color: '',
    odometer_km: '', registration_place: '',
    major_scratches: 0, original_paint: 1,
    accidents_reported: 0, previous_buyers: 0,
    desc1: '', desc2: '', desc3: '', desc4: '', desc5: ''
  });
  const [images, setImages] = useState({});
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const f = (field) => ({
    value: form[field],
    onChange: e => setForm({ ...form, [field]: e.target.value })
  });

  const handleImage = (key, dataUrl) => setImages(prev => ({ ...prev, [key]: dataUrl }));

  const handleNumberInput = (field) => ({
    value: form[field],
    min: 0,
    onChange: e => {
      const val = Math.max(0, parseInt(e.target.value) || 0);
      setForm({ ...form, [field]: val });
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const description = [form.desc1, form.desc2, form.desc3, form.desc4, form.desc5]
      .filter(d => d).join('||');
    const image_url = images.front || images.driver_side || Object.values(images)[0] || '';
    try {
      await API.post('/inventory', { ...form, description, image_url });
      setSuccess('Listing published successfully! Taking you to your dashboard...');
      setTimeout(() => navigate('/manage-cars'), 1400);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to publish listing');
      setLoading(false);
    }
  };

  const uploadedCount = Object.keys(images).length;

  return (
    <div>
      <div className="page-header">
        <h1>List a Car</h1>
        <p>Complete all sections accurately to build buyer confidence and sell faster</p>
      </div>

      {success && <div className="success-msg">{success}</div>}
      {error && <div className="error-msg">{error}</div>}

      <form onSubmit={handleSubmit}>

        {/* 1. Listing Details */}
        <div className="card">
          <div className="section-title">Listing Details</div>
          <div className="form-field">
            <label>Listing Title</label>
            <input placeholder="e.g. Honda City 2015 — Single Owner, Full Service History" {...f('title')} required />
          </div>
          <div className="form-grid-2">
            <div className="form-field">
              <label>Asking Price (INR)</label>
              <input type="number" placeholder="450000" {...handleNumberInput('asking_price')} required />
            </div>
            <div className="form-field">
              <label>Color</label>
              <input placeholder="Pearl White" {...f('color')} required />
            </div>
            <div className="form-field">
              <label>Odometer Reading (KM)</label>
              <input type="number" placeholder="45000" {...handleNumberInput('odometer_km')} required />
            </div>
            <div className="form-field">
              <label>Registration City</label>
              <input placeholder="Delhi" {...f('registration_place')} required />
            </div>
            <div className="form-field">
              <label>Previous Owners</label>
              <input type="number" placeholder="1" {...handleNumberInput('previous_buyers')} />
            </div>
            <div className="form-field">
              <label>Accidents Reported</label>
              <input type="number" placeholder="0" {...handleNumberInput('accidents_reported')} />
            </div>
          </div>
          <div className="form-grid-2" style={{ marginTop: '10px' }}>
            <div className="form-field">
              <label>Major Scratches</label>
              <div className="toggle-group">
                {['No', 'Yes'].map((opt, i) => (
                  <div key={i} className={`toggle-option ${form.major_scratches == i ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, major_scratches: i })}>{opt}</div>
                ))}
              </div>
            </div>
            <div className="form-field">
              <label>Original Paint</label>
              <div className="toggle-group">
                {['No', 'Yes'].map((opt, i) => (
                  <div key={i} className={`toggle-option ${form.original_paint == i ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, original_paint: i })}>{opt}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Key Highlights */}
        <div className="card">
          <div className="section-title">5 Key Highlights</div>
          <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '14px' }}>
            Bullet points buyers see first. Be specific and honest — this builds trust.
          </p>
          <div className="highlights-grid">
            {[1, 2, 3, 4, 5].map(n => (
              <div className="highlight-row" key={n}>
                <div className="highlight-num">{n}</div>
                <input placeholder={[
                  'e.g. Single owner from new, all service records maintained',
                  'e.g. New tyres and brakes fitted in 2024',
                  'e.g. Zero accidents, clean RC with clear title',
                  'e.g. All original documents — RC, insurance, PUC available',
                  'e.g. Non-smoker vehicle, no flood or fire damage'
                ][n - 1]} {...f(`desc${n}`)} />
              </div>
            ))}
          </div>
        </div>

        {/* 3. Car Photos — last */}
        <div className="card">
          <div className="section-title">
            Car Photos
            <span style={{
              marginLeft: 'auto', fontWeight: 500, fontSize: '11px', textTransform: 'none',
              letterSpacing: 0, color: uploadedCount >= 3 ? '#1a7a40' : 'var(--text-3)'
            }}>
              {uploadedCount}/6 uploaded{uploadedCount >= 3 ? ' · Good to go' : ' · Min. 3 recommended'}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '16px' }}>
            Listings with photos from multiple angles receive significantly more enquiries. Upload clear, well-lit photos.
          </p>
          <div className="img-grid">
            {CAR_ANGLES.map(angle => (
              <ImageUploadSlot key={angle.key} angle={angle} value={images[angle.key]} onChange={handleImage} />
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Publishing...' : 'Publish Listing'}
          </button>
          <button type="button" className="btn-ghost" onClick={() => navigate('/manage-cars')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCar;