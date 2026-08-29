import React, { useState } from 'react';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');

  const discountPercent = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isFav = isInWishlist(product.id);

  return (
    <div className="product-card animate-fade">
      {/* Image Wrap */}
      <div className="product-image-wrap">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'}
          alt={product.name}
          loading="lazy"
        />

        {/* Top Floating Badges */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 2 }}>
          {discountPercent > 0 && (
            <span className="badge badge-sale">-{discountPercent}%</span>
          )}
          {product.isFeatured && (
            <span className="badge badge-featured">Hot</span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 2,
            transition: 'transform 0.2s ease',
          }}
          title="Yêu thích"
        >
          <Heart size={18} color={isFav ? '#ec4899' : '#fff'} fill={isFav ? '#ec4899' : 'none'} />
        </button>

        {/* Quick View Button */}
        <button
          onClick={() => onQuickView(product)}
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            fontSize: '0.8rem',
            fontWeight: 600,
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 2,
          }}
        >
          <Eye size={14} /> Xem nhanh
        </button>
      </div>

      {/* Product Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          {/* Category & Rating */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {product.category || 'Thời trang'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              <span>{product.rating || 5.0}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({product.reviewCount || 0})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onQuickView(product)}
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              marginBottom: '10px',
              cursor: 'pointer',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4,
            }}
          >
            {product.name}
          </h3>
        </div>

        <div>
          {/* Size Selectors */}
          {product.sizes && product.sizes.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Size:</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    style={{
                      padding: '2px 8px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      borderRadius: '4px',
                      border: selectedSize === s ? '1px solid var(--primary-color)' : '1px solid var(--border-subtle)',
                      background: selectedSize === s ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                      color: selectedSize === s ? 'var(--primary-color)' : 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price & Add to Cart */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>
                {product.price?.toLocaleString('vi-VN')}đ
              </div>
              {product.originalPrice > product.price && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                  {product.originalPrice?.toLocaleString('vi-VN')}đ
                </div>
              )}
            </div>

            <button
              onClick={() => addToCart(product, selectedSize)}
              className="btn btn-primary"
              style={{ padding: '8px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem' }}
            >
              <ShoppingBag size={16} /> Thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
