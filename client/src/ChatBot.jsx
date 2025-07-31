import React, { useState } from 'react';
import axios from 'axios';

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hello! How can I help you with your residence permit?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:3000/api/ask', { question: input });
      const botMessage = { from: 'bot', text: res.data.answer };
      setMessages((msgs) => [...msgs, botMessage]);
    } catch {
      setMessages((msgs) => [...msgs, { from: 'bot', text: 'Sorry, something went wrong.' }]);
    }

    setInput('');
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 480, margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Residence Permit Assistant</h2>
      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: 8,
          padding: 12,
          height: 350,
          overflowY: 'auto',
          backgroundColor: '#fafafa',
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 8,
            }}
          >
            <div
              style={{
                backgroundColor: msg.from === 'user' ? '#007bff' : '#e5e5ea',
                color: msg.from === 'user' ? 'white' : 'black',
                padding: '10px 14px',
                borderRadius: 20,
                maxWidth: '70%',
                wordWrap: 'break-word',
                fontSize: 14,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ fontStyle: 'italic', color: '#666', paddingLeft: 10 }}>Assistant is typing...</div>
        )}
      </div>

      <div style={{ display: 'flex', marginTop: 12 }}>
        <input
          type="text"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          style={{
            flexGrow: 1,
            padding: 10,
            fontSize: 16,
            borderRadius: 20,
            border: '1px solid #ccc',
            outline: 'none',
          }}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            marginLeft: 8,
            padding: '0 20px',
            fontSize: 16,
            borderRadius: 20,
            border: 'none',
            backgroundColor: '#007bff',
            color: 'white',
            cursor: 'pointer',
            opacity: loading || !input.trim() ? 0.6 : 1,
            transition: 'opacity 0.3s',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
