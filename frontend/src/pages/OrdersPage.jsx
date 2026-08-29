import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, Truck, XCircle, AlertCircle } from 'lucide-react';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/orders/user/${user.id}`);
      if (res.success && res.data) setOrders(res.data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return;
    try {
      await apiFetch(`/orders/${orderId}/cancel`, { method: 'PUT' });
      fetchOrders();
    } catch (e) {}
  };

  const getStatusStep = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 1;
      case 'PROCESSING': return 2;
      case 'SHIPPED': return 3;
      case 'DELIVERED': return 4;
      case 'CANCELLED': return -1;
      default: return 1;
    }
  };

  if (!user) {
    return (
      <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
        <h2>Vui lòng đăng nhập để xem lịch sử đơn hàng</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '60px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '28px' }}>Quản Lý Đơn Hàng Của Bạn</h1>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải thông tin đơn hàng...</div>
      ) : orders.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Package size={56} style={{ marginBottom: '12px' }} />
          <h3>Bạn chưa có đơn hàng nào</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {orders.map((order) => {
            const step = getStatusStep(order.status);
            const isCancelled = step === -1;

            return (
              <div key={order.id} className="glass-panel animate-fade" style={{ padding: '24px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px', marginBottom: '20px' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>MÃ ĐƠN HÀNG</span>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--primary-color)' }}>#{order.id}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '12px' }}>
                      ({new Date(order.createdAt).toLocaleDateString('vi-VN')})
                    </span>
                  </div>
                  <div>
                    <span
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        background: isCancelled ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)',
                        color: isCancelled ? '#ef4444' : '#4ade80',
                        border: isCancelled ? '1px solid #ef4444' : '1px solid #22c55e',
                      }}
                    >
                      {isCancelled ? 'ĐÃ HỦY' : order.status}
                    </span>
                  </div>
                </div>

                {/* Progress Status Timeline */}
                {!isCancelled && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '24px', padding: '0 20px' }}>
                    <div style={{ position: 'absolute', top: '14px', left: '40px', right: '40px', height: '3px', background: 'var(--border-subtle)', zIndex: 1 }} />
                    <div style={{ position: 'absolute', top: '14px', left: '40px', width: `${((step - 1) / 3) * 100}%`, height: '3px', background: 'var(--accent-gradient)', zIndex: 2, transition: 'width 0.4s ease' }} />

                    {[
                      { s: 1, label: 'Đã Đặt', icon: Clock },
                      { s: 2, label: 'Đang Chuẩn Bị', icon: Package },
                      { s: 3, label: 'Đang Giao', icon: Truck },
                      { s: 4, label: 'Đã Giao', icon: CheckCircle },
                    ].map((st) => {
                      const Icon = st.icon;
                      const active = step >= st.s;
                      return (
                        <div key={st.s} style={{ position: 'relative', zIndex: 3, textAlign: 'center' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: active ? 'var(--primary-color)' : 'var(--bg-secondary)',
                              border: active ? '2px solid #fff' : '2px solid var(--border-subtle)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto 6px auto',
                              color: '#fff',
                            }}
                          >
                            <Icon size={16} />
                          </div>
                          <span style={{ fontSize: '0.78rem', fontWeight: active ? 700 : 500, color: active ? '#fff' : 'var(--text-muted)' }}>
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  {order.items?.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
                      <img src={item.productImage} alt="" style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '6px' }} />
                      <div style={{ flex: 1 }}>
                        <span style={{ fontWeight: 700 }}>{item.productName}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '8px' }}>
                          (Size: {item.size}) x {item.quantity}
                        </span>
                      </div>
                      <div style={{ fontWeight: 700 }}>{(item.unitPrice * item.quantity).toLocaleString('vi-VN')}đ</div>
                    </div>
                  ))}
                </div>

                {/* Summary & Cancel button */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Địa chỉ: {order.shippingAddress}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>
                      Tổng tiền: {order.totalAmount?.toLocaleString('vi-VN')}đ
                    </div>
                    {!isCancelled && order.status !== 'DELIVERED' && (
                      <button onClick={() => handleCancel(order.id)} className="btn btn-secondary" style={{ color: '#ef4444', padding: '6px 14px', fontSize: '0.85rem' }}>
                        Hủy Đơn
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
