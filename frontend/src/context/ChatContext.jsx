import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId] = useState(() => {
    let id = localStorage.getItem('shop_chat_session');
    if (!id) {
      id = 'session_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('shop_chat_session', id);
    }
    return id;
  });

  const fetchMessages = async () => {
    try {
      const res = await apiFetch(`/chat/messages/${sessionId}`);
      if (res.success && res.data) {
        setMessages(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch chat history', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, sessionId]);

  const sendMessage = async (text, senderName = 'Khách Hàng', isFromAdmin = false) => {
    if (!text.trim()) return;

    // Optimistic UI update
    const tempMsg = {
      sessionId,
      senderId: 'user',
      senderName,
      message: text,
      isFromAdmin,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      await apiFetch('/chat/send', {
        method: 'POST',
        body: JSON.stringify(tempMsg),
      });
      fetchMessages();
    } catch (err) {
      console.error('Error sending message', err);
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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
