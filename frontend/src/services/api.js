const API_BASE_URL = 'http://localhost:8085/api';

// Event listener mechanism for Anti-DDoS / Rate Limit alerts
let onRateLimitCallback = null;

export const setRateLimitHandler = (callback) => {
  onRateLimitCallback = callback;
};

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('shop_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 429) {
      const data = await response.json().catch(() => ({}));
      const retryAfter = response.headers.get('Retry-After') || data.retryAfterSeconds || 60;
      
      if (onRateLimitCallback) {
        onRateLimitCallback({
          message: data.message || 'Cảnh báo Anti-DDoS: Bạn đã vượt quá giới hạn lượt gửi yêu cầu.',
          retryAfter: parseInt(retryAfter, 10),
        });
      }

      throw new Error('RATE_LIMIT_EXCEEDED');
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Có lỗi xảy ra từ máy chủ');
    }

    return data;
  } catch (error) {
    if (error.message === 'RATE_LIMIT_EXCEEDED') {
      throw error;
    }
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};
