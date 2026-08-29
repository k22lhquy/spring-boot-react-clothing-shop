import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck, CreditCard, Share2, Globe, MessageCircle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '60px', paddingBottom: '30px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px' }}>
        
        {/* About */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff' }}>
              T
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              TRENDS STORE
            </span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
            Thương hiệu thời trang cao cấp hàng đầu dành cho giới trẻ. Phong cách hiện đại, chất lượng cam kết và dịch vụ hỗ trợ 24/7.
          </p>
          <div style={{ display: 'flex', gap: '12px', color: 'var(--text-muted)' }}>
            <Share2 size={20} style={{ cursor: 'pointer' }} />
            <Globe size={20} style={{ cursor: 'pointer' }} />
            <MessageCircle size={20} style={{ cursor: 'pointer' }} />
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: '#fff' }}>VỀ SHOP TRENDS</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <li style={{ cursor: 'pointer' }}>Giới thiệu thương hiệu</li>
            <li style={{ cursor: 'pointer' }}>Hệ thống cửa hàng</li>
            <li style={{ cursor: 'pointer' }}>Chính sách bảo mật</li>
            <li style={{ cursor: 'pointer' }}>Chống DDoS & Hạn chế spam</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: '#fff' }}>HỖ TRỢ KHÁCH HÀNG</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <li style={{ cursor: 'pointer' }}>Hướng dẫn chọn size</li>
            <li style={{ cursor: 'pointer' }}>Chính sách đổi trả trong 7 ngày</li>
            <li style={{ cursor: 'pointer' }}>Phương thức thanh toán</li>
            <li style={{ cursor: 'pointer' }}>Tra cứu đơn hàng</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: '#fff' }}>THÔNG TIN LIÊN HỆ</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={18} color="var(--primary-color)" />
              <span>72 Nguyễn Trãi, Q. Thanh Xuân, Hà Nội</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Phone size={18} color="var(--primary-color)" />
              <span>Hotline: 1900 8888 (8:00 - 22:00)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={18} color="var(--primary-color)" />
              <span>cskh@trendstore.com</span>
            </div>
          </div>
        </div>

      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '40px', paddingTop: '20px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
        © 2026 Trends Clothing Store. Spring Boot MVC + React + MongoDB + Anti-DDoS Rate Limiting.
      </div>
    </footer>
  );
};
