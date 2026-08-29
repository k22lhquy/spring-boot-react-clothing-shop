import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, Tag, ArrowRight, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer = ({ onProceedToCheckout }) => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    appliedVoucher,
    applyVoucherCode,
    removeVoucher,
    getSubtotal,
    getDiscountAmount,
    getTotalPrice,
  } = useCart();

  const [voucherInput, setVoucherInput] = useState('');
  const [voucherError, setVoucherError] = useState('');
  const [voucherSuccess, setVoucherSuccess] = useState('');
  const [applying, setApplying] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyVoucher = async (e) => {
    e.preventDefault();
    setVoucherError('');
    setVoucherSuccess('');
    if (!voucherInput.trim()) return;

    setApplying(true);
    try {
      await applyVoucherCode(voucherInput);
      setVoucherSuccess(`Đã áp dụng mã ${voucherInput.toUpperCase()} thành công!`);
      setVoucherInput('');
    } catch (err) {
      setVoucherError(err.message || 'Mã giảm giá không hợp lệ');
    } finally {
      setApplying(false);
    }
  };

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
          maxWidth: '480px',
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
            <ShoppingBag size={22} color="var(--primary-color)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Giỏ Hàng Của Bạn</h2>
          </div>
          <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-muted)' }}>
              <ShoppingBag size={56} color="var(--border-bright)" style={{ marginBottom: '12px' }} />
              <p style={{ fontSize: '1.05rem', fontWeight: 600 }}>Giỏ hàng của bạn chưa có sản phẩm nào</p>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  gap: '14px',
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  alignItems: 'center',
                }}
              >
                <img
                  src={item.productImage || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200'}
                  alt={item.productName}
                  style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px' }}>{item.productName}</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Size: <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>{item.size}</span> | Màu: {item.color}
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38bdf8' }}>
                    {item.unitPrice?.toLocaleString('vi-VN')}đ
                  </div>
                </div>

                {/* Quantity Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.4)', borderRadius: '6px', padding: '2px 6px' }}>
                    <button onClick={() => updateQuantity(index, -1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                      <Minus size={14} />
                    </button>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(index, 1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(index)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Voucher & Summary Footer */}
        {cartItems.length > 0 && (
          <div
            style={{
              padding: '20px',
              borderTop: '1px solid var(--border-subtle)',
              background: 'var(--bg-secondary)',
            }}
          >
            {/* Voucher Section */}
            <div style={{ marginBottom: '16px' }}>
              {appliedVoucher ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(34,197,94,0.15)', border: '1px dashed #22c55e', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ade80', fontSize: '0.88rem', fontWeight: 700 }}>
                    <Tag size={16} /> Mã: {appliedVoucher.code} (-{appliedVoucher.discountPercent}%)
                  </div>
                  <button onClick={removeVoucher} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>
                    Hủy
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyVoucher} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Mã giảm giá (VD: WELCOME10)"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value)}
                    style={{ textTransform: 'uppercase', padding: '8px 12px', fontSize: '0.88rem' }}
                  />
                  <button type="submit" disabled={applying} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.88rem' }}>
                    Áp Dụng
                  </button>
                </form>
              )}
              {voucherError && <div style={{ fontSize: '0.78rem', color: '#fca5a5', marginTop: '4px' }}>{voucherError}</div>}
              {voucherSuccess && <div style={{ fontSize: '0.78rem', color: '#4ade80', marginTop: '4px' }}>{voucherSuccess}</div>}
            </div>

            {/* Total Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Tạm tính:</span>
                <span>{getSubtotal().toLocaleString('vi-VN')}đ</span>
              </div>
              {getDiscountAmount() > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4ade80' }}>
                  <span>Giảm giá voucher:</span>
                  <span>-{getDiscountAmount().toLocaleString('vi-VN')}đ</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: '#fff', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                <span>Tổng tiền:</span>
                <span style={{ color: '#38bdf8' }}>{getTotalPrice().toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                onProceedToCheckout();
              }}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-sm)', fontSize: '1.05rem' }}
            >
              Thanh Toán Ngay <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
