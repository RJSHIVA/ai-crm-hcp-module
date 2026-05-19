import React, { useState } from 'react';
import FormMode from '../components/FormMode';
import ChatMode from '../components/ChatMode';
import { useDispatch } from 'react-redux';
import { clearChat } from '../store/interactionSlice';

function LogInteractionPage() {
  const [mode, setMode] = useState('form');
  const dispatch = useDispatch();

  const styles = {
    page: { maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' },
    header: { marginBottom: '1.5rem' },
    title: { fontSize: '1.6rem', fontWeight: '700', color: '#1a1a2e' },
    subtitle: { color: '#718096', fontSize: '0.9rem', marginTop: '0.3rem' },
    toggleRow: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: '#fff', padding: '0.4rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', width: 'fit-content' },
    activeBtn: { padding: '0.6rem 1.5rem', background: '#0f3460', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' },
    inactiveBtn: { padding: '0.6rem 1.5rem', background: 'transparent', color: '#718096', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem' },
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    if (newMode === 'chat') dispatch(clearChat());
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>📝 Log HCP Interaction</h1>
        <p style={styles.subtitle}>Record your meeting with a Healthcare Professional</p>
      </div>

      <div style={styles.toggleRow}>
        <button
          style={mode === 'form' ? styles.activeBtn : styles.inactiveBtn}
          onClick={() => handleModeSwitch('form')}
        >
          📋 Form Mode
        </button>
        <button
          style={mode === 'chat' ? styles.activeBtn : styles.inactiveBtn}
          onClick={() => handleModeSwitch('chat')}
        >
          🤖 AI Chat Mode
        </button>
      </div>

      {mode === 'form' ? <FormMode /> : <ChatMode />}
    </div>
  );
}

export default LogInteractionPage;