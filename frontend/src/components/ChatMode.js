import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendAgentMessage, addChatMessage } from '../store/interactionSlice';

function ChatMode() {
  const dispatch = useDispatch();
  const { chatHistory, loading } = useSelector(state => state.interactions);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    dispatch(addChatMessage(userMsg));
    setInput('');
    const result = await dispatch(sendAgentMessage({
      message: input,
      conversation_history: chatHistory,
    }));
    if (result.payload) {
      dispatch(addChatMessage({ role: 'assistant', content: result.payload.response || result.payload }));
    }
  };

  const styles = {
    container: { display: 'flex', flexDirection: 'column', height: '500px', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
    messages: { flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
    userBubble: { alignSelf: 'flex-end', background: '#0f3460', color: '#fff', padding: '0.6rem 1rem', borderRadius: '16px 16px 4px 16px', maxWidth: '70%', fontSize: '0.9rem' },
    botBubble: { alignSelf: 'flex-start', background: '#f0f2f5', color: '#1a1a2e', padding: '0.6rem 1rem', borderRadius: '16px 16px 16px 4px', maxWidth: '75%', fontSize: '0.9rem', whiteSpace: 'pre-wrap' },
    inputRow: { display: 'flex', gap: '0.5rem', padding: '1rem', borderTop: '1px solid #eee' },
    input: { flex: 1, padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', outline: 'none' },
    btn: { padding: '0.7rem 1.2rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
    hint: { padding: '0.5rem 1rem', background: '#fff8e1', fontSize: '0.8rem', color: '#856404', borderBottom: '1px solid #eee' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.hint}>
        💡 Try: "Log meeting with Dr. Sharma today about Product X, positive response" or "Show history of Dr. Mehta"
      </div>
      <div style={styles.messages}>
        {chatHistory.length === 0 && (
          <div style={{ textAlign: 'center', color: '#aaa', marginTop: '2rem' }}>
            👋 Hi! Tell me about your HCP interaction and I'll log it for you.
          </div>
        )}
        {chatHistory.map((msg, i) => (
          <div key={i} style={msg.role === 'user' ? styles.userBubble : styles.botBubble}>
            {msg.content}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
        />
        <button style={styles.btn} onClick={handleSend} disabled={loading}>
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default ChatMode;