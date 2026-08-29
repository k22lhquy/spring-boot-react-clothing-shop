import React, { useState, useEffect } from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { apiFetch } from '../services/api';
import { ProductCard } from '../components/ProductCard';

export const Catalog = ({ initialCategory, searchQuery, onQuickView }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [selectedSize, setSelectedSize] = useState('');
  const [maxPrice, setMaxPrice] = useState(2000000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/categories')
      .then((res) => {
        if (res.success && res.data) setCategories(res.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    let url = `/products?category=${selectedCategory}`;
    if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
    if (selectedSize) url += `&size=${selectedSize}`;
    if (maxPrice) url += `&maxPrice=${maxPrice}`;

    apiFetch(url)
      .then((res) => {
        if (res.success && res.data) setProducts(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery, selectedSize, maxPrice]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSize('');
    setMaxPrice(2000000);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px', paddingBottom: '60px' }}>
      {/* Sidebar Filter */}
      <aside className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '1.1rem' }}>
            <Filter size={20} color="var(--primary-color)" /> Bộ Lọc Tìm Kiếm
          </div>
          <button onClick={resetFilters} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} title="Đặt lại">
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Categories */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-muted)' }}>DANH MỤC SẢN PHẨM</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              onClick={() => setSelectedCategory('all')}
              style={{
                textAlign: 'left',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                background: selectedCategory === 'all' ? 'var(--accent-gradient)' : 'transparent',
                color: selectedCategory === 'all' ? '#fff' : 'var(--text-main)',
                border: 'none',
                fontWeight: selectedCategory === 'all' ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              Tất Cả Sản Phẩm
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                style={{
                  textAlign: 'left',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: selectedCategory === cat.slug ? 'var(--accent-gradient)' : 'transparent',
                  color: selectedCategory === cat.slug ? '#fff' : 'var(--text-main)',
                  border: 'none',
                  fontWeight: selectedCategory === cat.slug ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Size Filter */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-muted)' }}>KÍCH THƯỚC (SIZE)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {['S', 'M', 'L', 'XL'].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(selectedSize === s ? '' : s)}
                style={{
                  padding: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  borderRadius: '6px',
                  border: selectedSize === s ? '1px solid var(--primary-color)' : '1px solid var(--border-subtle)',
                  background: selectedSize === s ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                  color: selectedSize === s ? 'var(--primary-color)' : 'var(--text-main)',
                  cursor: 'pointer',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-muted)' }}>
            MỨC GIÁ TỐI ĐA: <span style={{ color: '#38bdf8' }}>{maxPrice.toLocaleString('vi-VN')}đ</span>
          </h4>
          <input
            type="range"
            min="100000"
            max="2000000"
            step="50000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary-color)', cursor: 'pointer' }}
          />
        </div>
      </aside>

      {/* Main Catalog Grid */}
      <main>
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            {searchQuery ? `Kết quả cho "${searchQuery}"` : 'Danh Sách Thời Trang'}
          </h2>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{products.length} sản phẩm</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Đang tải danh sách sản phẩm...</div>
        ) : products.length === 0 ? (
          <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
