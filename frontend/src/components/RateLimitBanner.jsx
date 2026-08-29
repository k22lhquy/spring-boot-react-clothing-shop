import React, { useState, useEffect } from 'react';
import { ShieldAlert, Clock, X } from 'lucide-react';
import { setRateLimitHandler } from '../services/api';

export const RateLimitBanner = () => {
  const [rateLimitInfo, setRateLimitInfo] = useState(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    setRateLimitHandler((info) => {
      setRateLimitInfo(info);
      setCountdown(info.retryAfter || 60);
    });
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      setRateLimitInfo(null);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  if (!rateLimitInfo || countdown <= 0) return null;

  return (
    <div className="ddos-banner animate-fade">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <ShieldAlert size={26} color="#fca5a5" />
        <div>
          <strong style={{ fontSize: '1rem' }}>CẢNH BÁO ANTI-DDOS / RATE-LIMIT!</strong>
          <p style={{ fontSize: '0.88rem', opacity: 0.9 }}>
            Hệ thống phát hiện lượt truy cập liên tục bất thường từ IP của bạn. Các yêu cầu tiếp theo tạm thời bị hạn chế.
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0,0,0,0.3)',
            padding: '6px 14px',
            borderRadius: '20px',
            fontWeight: 700,
          }}
        >
          <Clock size={16} />
          <span>Thử lại sau: {countdown}s</span>
        </div>
        <button
          onClick={() => setRateLimitInfo(null)}
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};
