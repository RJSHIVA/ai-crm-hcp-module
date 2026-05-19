import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createInteraction } from '../store/interactionSlice';

function FormMode() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    hcp_name: '', interaction_type: 'Meeting', date: '',
    time: '', attendees: '', topics_discussed: '',
    materials_shared: '', samples_distributed: '',
    sentiment: 'neutral', outcomes: '', follow_up_actions: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.hcp_name || !form.date) {
      alert('HCP Name aur Date zaroori hai!');
      return;
    }
    await dispatch(createInteraction(form));
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ hcp_name: '', interaction_type: 'Meeting', date: '', time: '',
      attendees: '', topics_discussed: '', materials_shared: '',
      samples_distributed: '', sentiment: 'neutral', outcomes: '', follow_up_actions: '' });
  };

  const styles = {
    container: { background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
    fullWidth: { gridColumn: '1 / -1' },
    label: { display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#555', marginBottom: '0.3rem' },
    input: { width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' },
    select: { width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', background: '#fff', boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', resize: 'vertical', minHeight: '80px', boxSizing: 'border-box' },
    btn: { marginTop: '1rem', padding: '0.75rem 2rem', background: '#0f3460', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem' },
    success: { marginTop: '1rem', padding: '0.75rem', background: '#d4edda', color: '#155724', borderRadius: '8px', textAlign: 'center', fontWeight: '500' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        <div>
          <label style={styles.label}>HCP Name *</label>
          <input style={styles.input} name="hcp_name" value={form.hcp_name} onChange={handleChange} placeholder="Dr. Sharma" />
        </div>
        <div>
          <label style={styles.label}>Interaction Type</label>
          <select style={styles.select} name="interaction_type" value={form.interaction_type} onChange={handleChange}>
            <option>Meeting</option><option>Call</option><option>Email</option><option>Conference</option>
          </select>
        </div>
        <div>
          <label style={styles.label}>Date *</label>
          <input style={styles.input} type="date" name="date" value={form.date} onChange={handleChange} />
        </div>
        <div>
          <label style={styles.label}>Time</label>
          <input style={styles.input} type="time" name="time" value={form.time} onChange={handleChange} />
        </div>
        <div>
          <label style={styles.label}>Attendees</label>
          <input style={styles.input} name="attendees" value={form.attendees} onChange={handleChange} placeholder="Rep name, Manager" />
        </div>
        <div>
          <label style={styles.label}>Sentiment</label>
          <select style={styles.select} name="sentiment" value={form.sentiment} onChange={handleChange}>
            <option value="positive">😊 Positive</option>
            <option value="neutral">😐 Neutral</option>
            <option value="negative">😟 Negative</option>
          </select>
        </div>
        <div style={styles.fullWidth}>
          <label style={styles.label}>Topics Discussed</label>
          <textarea style={styles.textarea} name="topics_discussed" value={form.topics_discussed} onChange={handleChange} placeholder="Product X efficacy, side effects, pricing..." />
        </div>
        <div>
          <label style={styles.label}>Materials Shared</label>
          <input style={styles.input} name="materials_shared" value={form.materials_shared} onChange={handleChange} placeholder="Brochure, Clinical data" />
        </div>
        <div>
          <label style={styles.label}>Samples Distributed</label>
          <input style={styles.input} name="samples_distributed" value={form.samples_distributed} onChange={handleChange} placeholder="Product X - 5 units" />
        </div>
        <div style={styles.fullWidth}>
          <label style={styles.label}>Outcomes</label>
          <textarea style={styles.textarea} name="outcomes" value={form.outcomes} onChange={handleChange} placeholder="Doctor agreed to prescribe, needs more info..." />
        </div>
        <div style={styles.fullWidth}>
          <label style={styles.label}>Follow-up Actions</label>
          <textarea style={styles.textarea} name="follow_up_actions" value={form.follow_up_actions} onChange={handleChange} placeholder="Call next week, send report..." />
        </div>
      </div>
      <button style={styles.btn} onClick={handleSubmit}>💾 Save Interaction</button>
      {submitted && <div style={styles.success}>✅ Interaction saved successfully!</div>}
    </div>
  );
}

export default FormMode;