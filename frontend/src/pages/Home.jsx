import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCw, Zap } from 'lucide-react';
import { apiFetch } from '../services/api';
import { ProductCard } from '../components/ProductCard';

export const Home = ({ onNavigateCatalog, onQuickView }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    apiFetch('/products?featured=true')
      .then((res) => {
        if (res.success && res.data) setFeaturedProducts(res.data);
      })
      .catch(() => {});

    apiFetch('/categories')
      .then((res) => {
        if (res.success && res.data) setCategories(res.data);
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', paddingBottom: '60px' }}>
      {/* Hero Banner Section */}
      <section
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          minHeight: '480px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(236,72,153,0.2) 100%), url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600") center/cover no-repeat',
          display: 'flex',
          alignItems: 'center',
          padding: '48px',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-bright)',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #0b0d14 40%, transparent 100%)' }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '580px' }} className="animate-slide-up">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(99, 102, 241, 0.2)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              color: '#a5b4fc',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '16px',
            }}
          >
            <Sparkles size={16} /> BỘ SƯU TẬP MỚI 2026
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '18px', letterSpacing: '-1px' }}>
            Phong Cách Định Hình <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Đẳng Cấp</span>
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '28px', lineHeight: 1.6 }}>
            Khám phá các thiết kế áo khoác, hoodie và quần denim cao cấp với chất liệu vượt trội. Tặng ngay voucher giảm 10% cho đơn hàng đầu tiên!
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button onClick={() => onNavigateCatalog('all')} className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1.05rem', borderRadius: 'var(--radius-full)' }}>
              Khám Phá Shop Ngay <ArrowRight size={20} />
            </button>
            <button onClick={() => onNavigateCatalog('ao-khoac')} className="btn btn-secondary" style={{ padding: '14px 24px', fontSize: '1rem', borderRadius: 'var(--radius-full)' }}>
              Áo Khoác Hot
            </button>
          </div>
        </div>
      </section>

      {/* Feature Highlights Bar */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>
            <Truck size={28} />
          </div>
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Freeship Đơn Từ 500K</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Giao hàng nhanh toàn quốc</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(236,72,153,0.15)', color: '#ec4899' }}>
            <RefreshCw size={28} />
          </div>
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Đổi Trả Trong 7 Ngày</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Miễn phí thủ tục đổi size</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Chất Lượng Cam Kết</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>100% hàng cao cấp</p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Danh Mục Nổi Bật</h2>
          <button onClick={() => onNavigateCatalog('all')} className="btn btn-outline" style={{ borderRadius: 'var(--radius-full)', padding: '6px 16px' }}>
            Xem Tất Cả
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '18px' }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigateCatalog(cat.slug)}
              className="glass-panel"
              style={{
                padding: '16px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              <img
                src={cat.imageUrl}
                alt={cat.name}
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%', marginBottom: '12px' }}
              />
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{cat.name}</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>{cat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Carousel/Grid */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <Zap size={26} color="var(--accent-gold)" />
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Sản Phẩm Bán Chạy</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
          ))}
        </div>
      </section>
    </div>
  );
};
