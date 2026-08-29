import React, { useState } from 'react';
import { CreditCard, QrCode, Truck, CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';

export const CheckoutPage = ({ onNavigateBack, onOrderSuccess }) => {
  const { cartItems, appliedVoucher, getSubtotal, getDiscountAmount, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState(user?.fullName || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!cartItems || cartItems.length === 0) return;

    setLoading(true);
    try {
      const orderPayload = {
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        paymentMethod,
        items: cartItems,
        voucherCode: appliedVoucher?.code || '',
      };

      const res = await apiFetch(`/orders${user ? `?userId=${user.id}` : ''}`, {
        method: 'POST',
        body: JSON.stringify(orderPayload),
      });

      if (res.success && res.data) {
        clearCart();
        onOrderSuccess(res.data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '60px' }}>
      <button onClick={onNavigateBack} className="btn btn-secondary" style={{ marginBottom: '24px' }}>
        <ArrowLeft size={18} /> Quay lại giỏ hàng
      </button>

      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '32px' }}>Thanh Toán Đơn Hàng</h1>

      {errorMsg && (
        <div style={{ padding: '14px', borderRadius: 'var(--radius-sm)', background: 'rgba(239,68,68,0.15)', color: '#fca5a5', marginBottom: '24px' }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '32px' }}>
        {/* Left Column: Customer info & payment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Customer Details */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={20} color="var(--primary-color)" /> Thông Tin Giao Hàng
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
                  Họ và tên người nhận *
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  required
                  className="input-field"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0912345678"
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
                Email nhận hóa đơn *
              </label>
              <input
                type="email"
                required
                className="input-field"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="customer@gmail.com"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
                Địa chỉ nhận hàng chi tiết *
              </label>
              <textarea
                required
                rows={3}
                className="input-field"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '18px' }}>Phương Thức Thanh Toán</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  border: paymentMethod === 'COD' ? '2px solid var(--primary-color)' : '1px solid var(--border-subtle)',
                  background: paymentMethod === 'COD' ? 'rgba(99,102,241,0.15)' : 'transparent',
                  cursor: 'pointer',
                }}
              >
                <input type="radio" name="payment" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                <Truck size={20} color="#38bdf8" />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>Thanh toán khi nhận hàng (COD)</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Thanh toán bằng tiền mặt khi shipper giao tới</span>
                </div>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  border: paymentMethod === 'QR_PAY' ? '2px solid var(--primary-color)' : '1px solid var(--border-subtle)',
                  background: paymentMethod === 'QR_PAY' ? 'rgba(99,102,241,0.15)' : 'transparent',
                  cursor: 'pointer',
                }}
              >
                <input type="radio" name="payment" checked={paymentMethod === 'QR_PAY'} onChange={() => setPaymentMethod('QR_PAY')} />
                <QrCode size={20} color="#a855f7" />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>Quét mã QR Ngân Hàng / Momo</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tự động duyệt đơn ngay sau khi chuyển khoản</span>
                </div>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  border: paymentMethod === 'CREDIT_CARD' ? '2px solid var(--primary-color)' : '1px solid var(--border-subtle)',
                  background: paymentMethod === 'CREDIT_CARD' ? 'rgba(99,102,241,0.15)' : 'transparent',
                  cursor: 'pointer',
                }}
              >
                <input type="radio" name="payment" checked={paymentMethod === 'CREDIT_CARD'} onChange={() => setPaymentMethod('CREDIT_CARD')} />
                <CreditCard size={20} color="#ec4899" />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>Thẻ Quốc Tế Visa / Mastercard</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bảo mật thanh toán chuẩn PCI-DSS</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="glass-panel" style={{ padding: '24px', height: 'fit-content', position: 'sticky', top: '100px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '18px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            Tóm Tắt Đơn Hàng ({cartItems.length} SP)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', maxHeight: '280px', overflowY: 'auto' }}>
            {cartItems.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.88rem' }}>
                <img src={item.productImage} alt="" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{item.productName}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    Size: {item.size} x {item.quantity}
                  </div>
                </div>
                <div style={{ fontWeight: 700 }}>{(item.unitPrice * item.quantity).toLocaleString('vi-VN')}đ</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Tạm tính:</span>
              <span>{getSubtotal().toLocaleString('vi-VN')}đ</span>
            </div>
            {getDiscountAmount() > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4ade80' }}>
                <span>Voucher giảm giá:</span>
                <span>-{getDiscountAmount().toLocaleString('vi-VN')}đ</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Phí vận chuyển:</span>
              <span style={{ color: '#4ade80', fontWeight: 700 }}>Miễn Phí</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, color: '#fff', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
              <span>Tổng thanh toán:</span>
              <span style={{ color: '#38bdf8' }}>{getTotalPrice().toLocaleString('vi-VN')}đ</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', marginTop: '24px', fontSize: '1.05rem', borderRadius: 'var(--radius-sm)' }}
          >
            {loading ? 'Đang Xử Lý Đơn Hàng...' : 'Xác Nhận Đặt Hàng'}
          </button>
        </div>
      </form>
    </div>
  );
};
