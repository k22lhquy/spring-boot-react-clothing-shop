import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, PhoneCall } from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const LiveChatWidget = () => {
  const { messages, isOpen, setIsOpen, sendMessage } = useChat();
  const [inputMsg, setInputMsg] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    sendMessage(inputMsg);
    setInputMsg('');
  };

  const handleQuickOption = (text) => {
    sendMessage(text);
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
      {/* Chat Window */}
      {isOpen && (
        <div
          className="glass-panel animate-slide-up"
          style={{
            width: '360px',
            height: '520px',
            marginBottom: '16px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 30px rgba(99,102,241,0.2)',
            border: '1px solid rgba(99,102,241,0.3)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 18px',
              background: 'var(--accent-gradient)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bot size={20} />
              </div>
              <div>
                <strong style={{ fontSize: '0.95rem', display: 'block' }}>Hỗ Trợ Khách Hàng Trends</strong>
                <span style={{ fontSize: '0.75rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80' }} />
                  Đang hoạt động (24/7)
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Quick Suggestions */}
          <div
            style={{
              padding: '10px 14px',
              background: 'rgba(19, 23, 34, 0.9)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
            }}
          >
            <button
              onClick={() => handleQuickOption('Tư vấn bảng size áo quần')}
              style={{
                whiteSpace: 'nowrap',
                fontSize: '0.75rem',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(99,102,241,0.15)',
                border: '1px solid rgba(99,102,241,0.3)',
                color: '#a5b4fc',
                cursor: 'pointer',
              }}
            >
              📏 Bảng size
            </button>
            <button
              onClick={() => handleQuickOption('Có mã giảm giá voucher nào không?')}
              style={{
                whiteSpace: 'nowrap',
                fontSize: '0.75rem',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(236,72,153,0.15)',
                border: '1px solid rgba(236,72,153,0.3)',
                color: '#f472b6',
                cursor: 'pointer',
              }}
            >
              🎟️ Mã giảm giá
            </button>
            <button
              onClick={() => handleQuickOption('Thời gian giao hàng mất bao lâu?')}
              style={{
                whiteSpace: 'nowrap',
                fontSize: '0.75rem',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(34,197,94,0.15)',
                border: '1px solid rgba(34,197,94,0.3)',
                color: '#4ade80',
                cursor: 'pointer',
              }}
            >
              🚚 Phí & thời gian ship
            </button>
          </div>

          {/* Messages Body */}
          <div
            style={{
              flex: 1,
              padding: '14px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              background: '#0e121c',
            }}
          >
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <Sparkles size={32} color="var(--primary-color)" style={{ marginBottom: '8px' }} />
                <p>Xin chào! Shop Trends có thể giúp gì cho bạn hôm nay?</p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: msg.isFromAdmin ? 'flex-start' : 'flex-end',
                }}
              >
                <div
                  style={{
                    maxWidth: '82%',
                    padding: '10px 14px',
                    borderRadius: '16px',
                    background: msg.isFromAdmin ? 'var(--bg-secondary)' : 'var(--accent-gradient)',
                    color: '#fff',
                    fontSize: '0.88rem',
                    border: msg.isFromAdmin ? '1px solid var(--border-subtle)' : 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  <div style={{ fontSize: '0.7rem', opacity: 0.8, marginBottom: '2px', fontWeight: 700 }}>
                    {msg.senderName || (msg.isFromAdmin ? 'Shop Assistant' : 'Bạn')}
                  </div>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{msg.message}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSend}
            style={{
              padding: '12px',
              background: 'var(--bg-secondary)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              gap: '8px',
            }}
          >
            <input
              type="text"
              className="input-field"
              placeholder="Nhập tin nhắn tư vấn..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              style={{ borderRadius: 'var(--radius-full)', padding: '8px 14px', fontSize: '0.88rem' }}
            />
            <button
              type="submit"
              className="btn btn-primary btn-icon"
              style={{ borderRadius: '50%', flexShrink: 0 }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-primary"
          style={{
            borderRadius: 'var(--radius-full)',
            padding: '14px 22px',
            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 700,
          }}
        >
          <MessageSquare size={22} />
          <span>Chat Hỗ Trợ</span>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4ade80' }} />
        </button>
      )}
    </div>
  );
};
