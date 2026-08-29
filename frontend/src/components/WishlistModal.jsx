import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export const WishlistModal = ({ isOpen, onClose }) => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 1100,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <div
        className="glass-panel animate-slide-up"
        style={{
          width: '100%',
          maxWidth: '450px',
          height: '100%',
          borderRadius: 0,
          background: '#131722',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Heart size={22} color="#ec4899" fill="#ec4899" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Danh Sách Yêu Thích ({wishlist.length})</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {wishlist.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-muted)' }}>
              <Heart size={48} color="var(--border-bright)" style={{ marginBottom: '12px' }} />
              <p>Chưa có sản phẩm nào trong danh sách yêu thích</p>
            </div>
          ) : (
            wishlist.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '14px',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  alignItems: 'center',
                }}
              >
                <img
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200'}
                  alt={item.name}
                  style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px' }}>{item.name}</h4>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38bdf8' }}>
                    {item.price?.toLocaleString('vi-VN')}đ
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    onClick={() => {
                      addToCart(item, item.sizes?.[0] || 'M');
                      toggleWishlist(item);
                    }}
                    className="btn btn-primary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                  >
                    <ShoppingBag size={14} /> Thêm
                  </button>
                  <button
                    onClick={() => toggleWishlist(item)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#ef4444' }}
                  >
                    <Trash2 size={14} /> Xóa
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
