import React, { useState, useRef, useEffect } from 'react';
import medicalService from '../../services/medicalService';
import './MedicalChatbot.css';

const WELCOME_MSG = {
  id: 'welcome',
  role: 'bot',
  text:
    "👋 Hi! I'm your FitFlow Medical Assistant powered by AI.\n\n" +
    "Tell me about any symptoms you're experiencing during or after " +
    "your workout — like:\n" +
    "• Joint or knee pain\n" +
    "• Muscle soreness or strain\n" +
    "• Dizziness or fatigue\n" +
    "• Chest tightness\n\n" +
    "I'll suggest the right doctor and give you safe exercise tips! 🩺",
  context: null,
};

const MedicalChatbot = () => {
  const [messages, setMessages]   = useState([WELCOME_MSG]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [context, setContext]     = useState(null);
  const bottomRef                 = useRef(null);
  const textareaRef               = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Build history for Gemini (only last 10 exchanges to save tokens)
  const buildHistory = () => {
    return messages
      .filter((m) => m.id !== 'welcome')
      .slice(-10)
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.text,
      }));
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { id: Date.now(), role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const data = await medicalService.sendChat(text, context, buildHistory());

      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        text: data.reply,
        suggestions: data.suggestions,
        exerciseTips: data.exercise_tips,
        context: data.context,
      };

      setMessages((prev) => [...prev, botMsg]);
      if (data.context) setContext(data.context);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'bot',
          text: '⚠️ Sorry, I had trouble connecting. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setContext(null);
    setMessages([
      {
        ...WELCOME_MSG,
        id: Date.now(),
        text: "Chat reset! 🔄 Tell me your symptoms and I'll help guide you. 🩺",
      },
    ]);
  };

  // Render formatted text (bold **text** and line breaks)
  const renderText = (text) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
          <br />
        </span>
      );
    });
  };

  return (
    <div className="chatbot-wrapper">

      {/* ── Header ── */}
      <div className="chatbot-header">
        <div className="chatbot-header-info">
          <div className="chatbot-avatar">🤖</div>
          <div>
            <h3>Medical Assistant</h3>
            <span className="chatbot-status">
              ● Powered by Gemini AI
            </span>
          </div>
        </div>
        <button className="chatbot-reset-btn" onClick={resetChat}>
          🔄 New Chat
        </button>
      </div>

      {/* ── Messages ── */}
      <div className="chatbot-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-msg ${msg.role}`}>

            {/* Bot avatar */}
            {msg.role === 'bot' && (
              <div className="msg-avatar bot-avatar">🤖</div>
            )}

            <div className="msg-content">
              {/* Bubble */}
              <div className="msg-bubble">
                <p className="msg-text">{renderText(msg.text)}</p>
              </div>

              {/* Doctor Suggestion Cards */}
              {msg.suggestions?.length > 0 && (
                <div className="suggestion-cards">
                  {msg.suggestions.map((s, i) => (
                    <div
                      key={i}
                      className={`suggestion-card urgency-${s.urgency}`}
                    >
                      <div className="suggestion-top">
                        <span className="suggestion-emoji">
                          {s.urgency === 'high'
                            ? '🚨'
                            : s.urgency === 'medium'
                            ? '⚠️'
                            : 'ℹ️'}
                        </span>
                        <strong>{s.doctor_type}</strong>
                        <span className={`urgency-badge ${s.urgency}`}>
                          {s.urgency.toUpperCase()}
                        </span>
                      </div>
                      <p>{s.reason}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Exercise Tips */}
              {msg.exerciseTips && (
                <div className="exercise-tips-card">
                  <div className="tips-block avoid">
                    <h4>❌ Exercises to Avoid</h4>
                    <ul>
                      {msg.exerciseTips.avoid?.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="tips-block recommended">
                    <h4>✅ Safe Exercises</h4>
                    <ul>
                      {msg.exerciseTips.recommended?.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="tips-block tips">
                    <h4>💡 Recovery Tips</h4>
                    <ul>
                      {msg.exerciseTips.tips?.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* User avatar */}
            {msg.role === 'user' && (
              <div className="msg-avatar user-avatar">👤</div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="chat-msg bot">
            <div className="msg-avatar bot-avatar">🤖</div>
            <div className="msg-bubble typing-bubble">
              <span /><span /><span />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input Area ── */}
      <div className="chatbot-input-area">
        <textarea
          ref={textareaRef}
          className="chatbot-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your symptoms... (Press Enter to send)"
          rows={2}
          disabled={loading}
        />
        <button
          className="chatbot-send-btn"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          {loading ? '⏳' : '➤'}
        </button>
      </div>

      <p className="chatbot-disclaimer">
        ⚕️ AI assistant only — not a substitute for professional medical advice.
        Always consult a qualified doctor.
      </p>
    </div>
  );
};

export default MedicalChatbot;