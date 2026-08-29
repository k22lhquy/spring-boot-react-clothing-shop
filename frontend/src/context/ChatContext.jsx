import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [sessionId] = useState(() => {
    let id = localStorage.getItem('shop_chat_session');
    if (!id) {
      id = 'session_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('shop_chat_session', id);
    }
    return id;
  });

  const [messages, setMessages] = useState(() => {
    const cached = localStorage.getItem(`shop_chat_msgs_${sessionId}`);
    return cached ? JSON.parse(cached) : [
      {
        sessionId,
        senderId: 'BOT',
        senderName: 'Trợ Lý Trends',
        message: 'Xin chào! Shop Trends sẵn sàng hỗ trợ bạn. Bạn cần tư vấn về áo quần hay size nào ạ?',
        isFromAdmin: true,
        timestamp: new Date().toISOString(),
      }
    ];
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    localStorage.setItem(`shop_chat_msgs_${sessionId}`, JSON.stringify(messages));
  }, [messages, sessionId]);

  const fetchMessages = async () => {
    try {
      const res = await apiFetch(`/chat/messages/${sessionId}`);
      if (res.success && res.data && res.data.length > 0) {
        setMessages(res.data);
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen]);

  const sendMessage = async (text, senderName = 'Khách Hàng', isFromAdmin = false) => {
    if (!text.trim()) return;

    const userMsg = {
      sessionId,
      senderId: 'user',
      senderName,
      message: text,
      isFromAdmin: false,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      await apiFetch('/chat/send', {
        method: 'POST',
        body: JSON.stringify(userMsg),
      });

      // Fetch auto-bot response after 600ms typing delay
      setTimeout(async () => {
        await fetchMessages();
        setIsTyping(false);
      }, 600);

    } catch (err) {
      setIsTyping(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isOpen,
        setIsOpen,
        sessionId,
        sendMessage,
        fetchMessages,
        isTyping,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
