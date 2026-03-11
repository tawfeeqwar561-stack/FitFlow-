import React, { useState, useEffect } from 'react';
import './MedicationTracker.css';

const FREQUENCY_OPTIONS = [
  'Once daily',
  'Twice daily',
  'Three times daily',
  'Every 8 hours',
  'Every 12 hours',
  'Weekly',
  'As needed',
];

const EMPTY_FORM = {
  name: '',
  dosage: '',
  frequency: '',
  start_date: '',
  end_date: '',
  prescribed_by: '',
  purpose: '',
  side_effects: '',
};

// ── LocalStorage helpers ──────────────────────────────────────────────────────
const STORAGE_KEY = 'fitflow_medications';

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (medications) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(medications));
};

// ─────────────────────────────────────────────────────────────────────────────

const MedicationTracker = () => {
  const [medications, setMedications] = useState(() => loadFromStorage());
  const [showForm, setShowForm]       = useState(false);
  const [editingId, setEditingId]     = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [error, setError]             = useState('');
  const [successMsg, setSuccessMsg]   = useState('');
  const [activeOnly, setActiveOnly]   = useState(false);

  // ── Sync to localStorage on every change ─────────────────────────────────
  useEffect(() => {
    saveToStorage(medications);
  }, [medications]);

  // ── Success toast ─────────────────────────────────────────────────────────
  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // ── Form helpers ──────────────────────────────────────────────────────────
  const openAddForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowForm(true);
  };

  const openEditForm = (med) => {
    setEditingId(med.id);
    setForm({
      name:          med.name          || '',
      dosage:        med.dosage        || '',
      frequency:     med.frequency     || '',
      start_date:    med.start_date    || '',
      end_date:      med.end_date      || '',
      prescribed_by: med.prescribed_by || '',
      purpose:       med.purpose       || '',
      side_effects:  med.side_effects  || '',
    });
    setError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError('');
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Medication name is required.');
      return;
    }

    if (editingId) {
      // Update existing
      setMedications((prev) =>
        prev.map((m) =>
          m.id === editingId ? { ...m, ...form } : m
        )
      );
      showSuccess('Medication updated! ✅');
    } else {
      // Add new
      const newMed = {
        ...form,
        id:         Date.now(),          // simple unique ID
        is_active:  true,
        created_at: new Date().toISOString(),
      };
      setMedications((prev) => [newMed, ...prev]);
      showSuccess('Medication added! ✅');
    }

    closeForm();
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = (id) => {
    if (!window.confirm('Delete this medication?')) return;
    setMedications((prev) => prev.filter((m) => m.id !== id));
    showSuccess('Medication deleted.');
  };

  // ── Toggle active ─────────────────────────────────────────────────────────
  const handleToggleActive = (id) => {
    setMedications((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, is_active: !m.is_active } : m
      )
    );
  };

  // ── Filtered list ─────────────────────────────────────────────────────────
  const displayed = activeOnly
    ? medications.filter((m) => m.is_active)
    : medications;

  const getFrequencyColor = (frequency) => {
    if (!frequency) return 'default';
    const f = frequency.toLowerCase();
    if (f.includes('three') || f.includes('every 8'))  return 'high';
    if (f.includes('twice') || f.includes('every 12')) return 'medium';
    return 'low';
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="med-tracker">

      {/* ── Toolbar ── */}
      <div className="med-toolbar">
        <label className="med-filter-toggle">
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={(e) => setActiveOnly(e.target.checked)}
          />
          <span>Show active only</span>
        </label>
        <button className="btn-add-med" onClick={openAddForm}>
          + Add Medication
        </button>
      </div>

      {/* ── Alerts ── */}
      {error      && <div className="med-alert error">⚠️ {error}</div>}
      {successMsg && <div className="med-alert success">✅ {successMsg}</div>}

      {/* ── Stats Bar ── */}
      {medications.length > 0 && (
        <div className="med-stats">
          <div className="med-stat">
            <span className="stat-num">{medications.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="med-stat">
            <span className="stat-num">
              {medications.filter((m) => m.is_active).length}
            </span>
            <span className="stat-label">Active</span>
          </div>
          <div className="med-stat">
            <span className="stat-num">
              {medications.filter((m) => !m.is_active).length}
            </span>
            <span className="stat-label">Inactive</span>
          </div>
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {showForm && (
        <div
          className="med-modal-overlay"
          onClick={(e) => e.target === e.currentTarget && closeForm()}
        >
          <div className="med-modal">
            <div className="med-modal-header">
              <h3>{editingId ? '✏️ Edit Medication' : '➕ Add Medication'}</h3>
              <button className="modal-close-btn" onClick={closeForm}>✕</button>
            </div>

            <form className="med-form" onSubmit={handleSubmit}>

              {/* Row 1 */}
              <div className="form-row">
                <div className="form-group">
                  <label>Medication Name <span className="required">*</span></label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Ibuprofen"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Dosage</label>
                  <input
                    name="dosage"
                    value={form.dosage}
                    onChange={handleChange}
                    placeholder="e.g. 200mg"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="form-row">
                <div className="form-group">
                  <label>Frequency</label>
                  <select
                    name="frequency"
                    value={form.frequency}
                    onChange={handleChange}
                  >
                    <option value="">Select frequency</option>
                    {FREQUENCY_OPTIONS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Prescribed By</label>
                  <input
                    name="prescribed_by"
                    value={form.prescribed_by}
                    onChange={handleChange}
                    placeholder="e.g. Dr. Smith"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={form.start_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    value={form.end_date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Purpose */}
              <div className="form-group">
                <label>Purpose</label>
                <input
                  name="purpose"
                  value={form.purpose}
                  onChange={handleChange}
                  placeholder="e.g. Pain relief, inflammation"
                />
              </div>

              {/* Side Effects */}
              <div className="form-group">
                <label>Known Side Effects</label>
                <textarea
                  name="side_effects"
                  value={form.side_effects}
                  onChange={handleChange}
                  placeholder="e.g. Nausea, drowsiness (optional)"
                  rows={2}
                />
              </div>

              {error && <p className="form-error">⚠️ {error}</p>}

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={closeForm}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editingId ? 'Update Medication' : 'Add Medication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Empty State ── */}
      {displayed.length === 0 ? (
        <div className="med-empty">
          <div className="med-empty-icon">💊</div>
          <h4>No medications found</h4>
          <p>
            {activeOnly
              ? 'No active medications. Toggle filter to see all.'
              : 'Click "+ Add Medication" to start tracking.'}
          </p>
        </div>

      /* ── Medication Cards ── */
      ) : (
        <div className="med-list">
          {displayed.map((med) => (
            <div
              key={med.id}
              className={`med-card ${med.is_active ? 'active' : 'inactive'}`}
            >
              {/* Header */}
              <div className="med-card-header">
                <div className="med-name-row">
                  <div className="med-icon-wrap">💊</div>
                  <div>
                    <h4 className="med-name">{med.name}</h4>
                    {med.dosage && (
                      <span className="med-dosage-badge">{med.dosage}</span>
                    )}
                  </div>
                </div>

                <div className="med-actions">
                  {/* Toggle */}
                  <label className="active-toggle" title="Toggle active">
                    <input
                      type="checkbox"
                      checked={med.is_active}
                      onChange={() => handleToggleActive(med.id)}
                    />
                    <span className="toggle-track">
                      <span className="toggle-thumb" />
                    </span>
                  </label>

                  {/* Edit */}
                  <button
                    className="med-btn edit"
                    onClick={() => openEditForm(med)}
                    title="Edit"
                  >
                    ✏️
                  </button>

                  {/* Delete */}
                  <button
                    className="med-btn delete"
                    onClick={() => handleDelete(med.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="med-card-body">
                {med.frequency && (
                  <div className="med-detail">
                    <span className="detail-icon">🕐</span>
                    <span className={`freq-badge ${getFrequencyColor(med.frequency)}`}>
                      {med.frequency}
                    </span>
                  </div>
                )}
                {med.prescribed_by && (
                  <div className="med-detail">
                    <span className="detail-icon">👨‍⚕️</span>
                    <span>Dr. {med.prescribed_by}</span>
                  </div>
                )}
                {(med.start_date || med.end_date) && (
                  <div className="med-detail">
                    <span className="detail-icon">📅</span>
                    <span>
                      {med.start_date || '?'} → {med.end_date || 'Ongoing'}
                    </span>
                  </div>
                )}
                {med.purpose && (
                  <div className="med-detail">
                    <span className="detail-icon">🎯</span>
                    <span>{med.purpose}</span>
                  </div>
                )}
                {med.side_effects && (
                  <div className="med-detail side-effects-row">
                    <span className="detail-icon">⚠️</span>
                    <span className="side-effects-text">{med.side_effects}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="med-card-footer">
                <span className={`status-pill ${med.is_active ? 'active' : 'inactive'}`}>
                  {med.is_active ? '● Active' : '○ Inactive'}
                </span>
                {med.created_at && (
                  <span className="med-date">
                    Added {new Date(med.created_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Local Storage Notice ── */}
      <div className="local-storage-notice">
        💾 Medications are saved locally on this device
      </div>

    </div>
  );
};

export default MedicationTracker;