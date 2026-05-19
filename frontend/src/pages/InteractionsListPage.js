import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInteractions, deleteInteraction, updateInteraction } from '../store/interactionSlice';

function InteractionsListPage() {
  const dispatch = useDispatch();
  const { list } = useSelector(state => state.interactions);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    dispatch(fetchInteractions());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this interaction?')) dispatch(deleteInteraction(id));
  };

  const handleEditStart = (interaction) => {
    setEditId(interaction.id);
    setEditData({ ...interaction });
  };

  const handleEditSave = () => {
    dispatch(updateInteraction({ id: editId, data: editData }));
    setEditId(null);
  };

  const sentimentColor = (s) => s === 'positive' ? '#d4edda' : s === 'negative' ? '#f8d7da' : '#fff3cd';
  const sentimentEmoji = (s) => s === 'positive' ? '😊' : s === 'negative' ? '😟' : '😐';

  const styles = {
    page: { maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' },
    title: { fontSize: '1.6rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '0.3rem' },
    subtitle: { color: '#718096', fontSize: '0.9rem', marginBottom: '1.5rem' },
    card: { background: '#fff', borderRadius: '12px', padding: '1.2rem', marginBottom: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: '4px solid #0f3460' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' },
    hcpName: { fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e' },
    badge: { padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem', color: '#555' },
    label: { fontWeight: '600', color: '#0f3460' },
    actions: { display: 'flex', gap: '0.5rem', marginTop: '1rem' },
    editBtn: { padding: '0.4rem 1rem', background: '#0f3460', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' },
    deleteBtn: { padding: '0.4rem 1rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' },
    saveBtn: { padding: '0.4rem 1rem', background: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' },
    cancelBtn: { padding: '0.4rem 1rem', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' },
    input: { width: '100%', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.85rem', boxSizing: 'border-box' },
    empty: { textAlign: 'center', padding: '3rem', color: '#aaa', fontSize: '1rem' },
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>📋 All HCP Interactions</h1>
      <p style={styles.subtitle}>{list.length} interaction(s) logged</p>

      {list.length === 0 && (
        <div style={styles.empty}>No interactions logged yet. Go log one! 📝</div>
      )}

      {list.map(interaction => (
        <div key={interaction.id} style={styles.card}>
          {editId === interaction.id ? (
            <>
              <div style={styles.grid}>
                {['hcp_name','interaction_type','date','attendees','topics_discussed','materials_shared','samples_distributed','outcomes','follow_up_actions'].map(field => (
                  <div key={field}>
                    <div style={styles.label}>{field.replace(/_/g,' ').toUpperCase()}</div>
                    <input style={styles.input} value={editData[field] || ''} onChange={e => setEditData({...editData, [field]: e.target.value})} />
                  </div>
                ))}
                <div>
                  <div style={styles.label}>SENTIMENT</div>
                  <select style={styles.input} value={editData.sentiment || 'neutral'} onChange={e => setEditData({...editData, sentiment: e.target.value})}>
                    <option value="positive">😊 Positive</option>
                    <option value="neutral">😐 Neutral</option>
                    <option value="negative">😟 Negative</option>
                  </select>
                </div>
              </div>
              <div style={styles.actions}>
                <button style={styles.saveBtn} onClick={handleEditSave}>✅ Save</button>
                <button style={styles.cancelBtn} onClick={() => setEditId(null)}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <div style={styles.cardHeader}>
                <span style={styles.hcpName}>👨‍⚕️ {interaction.hcp_name}</span>
                <span style={{...styles.badge, background: sentimentColor(interaction.sentiment)}}>
                  {sentimentEmoji(interaction.sentiment)} {interaction.sentiment}
                </span>
              </div>
              <div style={styles.grid}>
                <div><span style={styles.label}>Type: </span>{interaction.interaction_type}</div>
                <div><span style={styles.label}>Date: </span>{interaction.date}</div>
                {interaction.attendees && <div><span style={styles.label}>Attendees: </span>{interaction.attendees}</div>}
                {interaction.topics_discussed && <div style={{gridColumn:'1/-1'}}><span style={styles.label}>Topics: </span>{interaction.topics_discussed}</div>}
                {interaction.outcomes && <div style={{gridColumn:'1/-1'}}><span style={styles.label}>Outcomes: </span>{interaction.outcomes}</div>}
                {interaction.follow_up_actions && <div style={{gridColumn:'1/-1'}}><span style={styles.label}>Follow-ups: </span>{interaction.follow_up_actions}</div>}
              </div>
              <div style={styles.actions}>
                <button style={styles.editBtn} onClick={() => handleEditStart(interaction)}>✏️ Edit</button>
                <button style={styles.deleteBtn} onClick={() => handleDelete(interaction.id)}>🗑️ Delete</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default InteractionsListPage;