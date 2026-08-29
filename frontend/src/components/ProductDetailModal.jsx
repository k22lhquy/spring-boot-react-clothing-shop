import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Heart, Check, Send, MessageSquare } from 'lucide-react';
import { apiFetch } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export const ProductDetailModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user, openAuthModal } = useAuth();

  const [activeImage, setActiveImage] = useState(product?.images?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);

  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveImage(product.images?.[0] || '');
      setSelectedSize(product.sizes?.[0] || 'M');
      setSelectedColor(product.colors?.[0] || '');
      fetchReviews();
    }
  }, [product]);

  const fetchReviews = async () => {
    if (!product) return;
    try {
      const res = await apiFetch(`/reviews/product/${product.id}`);
      if (res.success && res.data) setReviews(res.data);
    } catch (e) {}
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }

    setSubmittingReview(true);
    try {
      await apiFetch('/reviews', {
        method: 'POST',
        body: JSON.stringify({
          productId: product.id,
          userId: user.id,
          userName: user.fullName || user.username,
          rating: newRating,
          comment: newComment,
        }),
      });
      setNewComment('');
      fetchReviews();
    } catch (e) {
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!product) return null;

  const isFav = isInWishlist(product.id);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)',
        zIndex: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        className="glass-panel animate-slide-up"
        style={{
          width: '100%',
          maxWidth: '900px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#131722',
          position: 'relative',
          padding: '32px',
        }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {/* Images Gallery */}
          <div>
            <div style={{ width: '100%', paddingTop: '100%', position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '14px' }}>
              <img
                src={activeImage || product.images?.[0]}
                alt={product.name}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '10px' }}>
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt=""
                    onClick={() => setActiveImage(img)}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: activeImage === img ? '2px solid var(--primary-color)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="badge badge-featured" style={{ marginBottom: '10px', display: 'inline-block' }}>
                {product.category || 'Mới Về'}
              </span>

              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '12px' }}>{product.name}</h2>

              {/* Rating Summary */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', color: '#f59e0b' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={18} fill={star <= Math.round(product.rating || 5) ? '#f59e0b' : 'none'} color="#f59e0b" />
                  ))}
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{product.rating || 5.0}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>({reviews.length} đánh giá từ khách hàng)</span>
              </div>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '20px' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8' }}>{product.price?.toLocaleString('vi-VN')}đ</span>
                {product.originalPrice > product.price && (
                  <span style={{ fontSize: '1.1rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                    {product.originalPrice?.toLocaleString('vi-VN')}đ
                  </span>
                )}
              </div>

              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
                {product.description}
              </p>

              {/* Size Selectors */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px', display: 'block' }}>
                  CHỌN KÍCH THƯỚC (SIZE):
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {product.sizes?.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      style={{
                        padding: '8px 16px',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        borderRadius: 'var(--radius-sm)',
                        border: selectedSize === s ? '2px solid var(--primary-color)' : '1px solid var(--border-subtle)',
                        background: selectedSize === s ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                        color: selectedSize === s ? '#fff' : 'var(--text-muted)',
                        cursor: 'pointer',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock status */}
              <div style={{ fontSize: '0.85rem', color: '#4ade80', fontWeight: 600, marginBottom: '24px' }}>
                ✓ Còn hàng trong kho ({product.stockQuantity || 50} sản phẩm)
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '14px' }}>
              <button
                onClick={() => {
                  addToCart(product, selectedSize, selectedColor, quantity);
                  onClose();
                }}
                className="btn btn-primary"
                style={{ flex: 1, padding: '14px', fontSize: '1.05rem', borderRadius: 'var(--radius-full)' }}
              >
                <ShoppingBag size={20} /> Thêm Vào Giỏ Hàng
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className="btn btn-secondary btn-icon"
                style={{ width: '50px', height: '50px', borderRadius: '50%' }}
              >
                <Heart size={22} color={isFav ? '#ec4899' : '#fff'} fill={isFav ? '#ec4899' : 'none'} />
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare size={22} color="var(--primary-color)" /> Đánh Giá & Nhận Xét ({reviews.length})
          </h3>

          {/* Submit Review */}
          <form onSubmit={handleReviewSubmit} style={{ marginBottom: '28px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Đánh giá của bạn:</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    style={{ cursor: 'pointer' }}
                    fill={star <= newRating ? '#f59e0b' : 'none'}
                    color="#f59e0b"
                    onClick={() => setNewRating(star)}
                  />
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                required
                className="input-field"
                placeholder={user ? "Viết nhận xét của bạn về sản phẩm..." : "Vui lòng đăng nhập để gửi nhận xét..."}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button type="submit" disabled={submittingReview} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                <Send size={16} /> Gửi Đánh Giá
              </button>
            </div>
          </form>

          {/* List Reviews */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {reviews.map((r, i) => (
              <div key={i} style={{ padding: '12px 16px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{r.userName}</span>
                  <div style={{ display: 'flex', color: '#f59e0b' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={14} fill={star <= r.rating ? '#f59e0b' : 'none'} color="#f59e0b" />
                    ))}
                  </div>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
