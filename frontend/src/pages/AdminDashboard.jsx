import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingBag, DollarSign, Plus, Trash2, Edit, CheckCircle } from 'lucide-react';
import { apiFetch } from '../services/api';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'
  const [stats, setStats] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Product Form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(490000);
  const [originalPrice, setOriginalPrice] = useState(650000);
  const [category, setCategory] = useState('ao-khoac');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800');
  const [stockQuantity, setStockQuantity] = useState(50);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const statsRes = await apiFetch('/admin/stats');
      if (statsRes.success) setStats(statsRes.data);

      const prodRes = await apiFetch('/products?category=all');
      if (prodRes.success) setProducts(prodRes.data);

      const ordRes = await apiFetch('/admin/orders');
      if (ordRes.success) setOrders(ordRes.data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/admin/products', {
        method: 'POST',
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          originalPrice: Number(originalPrice),
          category,
          images: [imageUrl],
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Đen', 'Trắng'],
          stockQuantity: Number(stockQuantity),
          isFeatured: true,
        }),
      });
      setIsAddModalOpen(false);
      fetchAdminData();
    } catch (e) {
      alert(e.message || 'Không thể tạo sản phẩm');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) return;
    try {
      await apiFetch(`/admin/products/${id}`, { method: 'DELETE' });
      fetchAdminData();
    } catch (e) {}
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await apiFetch(`/admin/orders/${orderId}/status?status=${newStatus}`, { method: 'PUT' });
      fetchAdminData();
    } catch (e) {}
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LayoutDashboard color="#a855f7" size={32} /> Admin Control Dashboard
        </h1>
      </div>

      {/* Overview Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(34,197,94,0.15)', color: '#4ade80' }}>
            <DollarSign size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TỔNG DOANH THU</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{(stats.totalRevenue || 0).toLocaleString('vi-VN')}đ</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>
            <ShoppingBag size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ĐƠN HÀNG</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{stats.totalOrders || 0} đơn</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
            <Package size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CẦN XỬ LÝ</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>{stats.pendingOrders || 0} đơn chờ</h3>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--border-subtle)' }}>
        <button
          onClick={() => setActiveTab('products')}
          style={{
            paddingBottom: '12px',
            fontSize: '1.05rem',
            fontWeight: 700,
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'products' ? '3px solid var(--primary-color)' : '3px solid transparent',
            color: activeTab === 'products' ? 'var(--primary-color)' : 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          Quản Lý Sản Phẩm ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            paddingBottom: '12px',
            fontSize: '1.05rem',
            fontWeight: 700,
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'orders' ? '3px solid var(--primary-color)' : '3px solid transparent',
            color: activeTab === 'orders' ? 'var(--primary-color)' : 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          Quản Lý Đơn Hàng ({orders.length})
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Danh Sách Kho Sản Phẩm</h3>
            <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary" style={{ padding: '8px 16px' }}>
              <Plus size={18} /> Thêm Sản Phẩm Mới
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px' }}>Hình Ảnh</th>
                  <th style={{ padding: '12px' }}>Tên Sản Phẩm</th>
                  <th style={{ padding: '12px' }}>Danh Mục</th>
                  <th style={{ padding: '12px' }}>Giá Bán</th>
                  <th style={{ padding: '12px' }}>Tồn Kho</th>
                  <th style={{ padding: '12px' }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px' }}>
                      <img src={p.images?.[0]} alt="" style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px' }} />
                    </td>
                    <td style={{ padding: '12px', fontWeight: 700 }}>{p.name}</td>
                    <td style={{ padding: '12px', color: 'var(--accent-gold)' }}>{p.category}</td>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#38bdf8' }}>{p.price?.toLocaleString('vi-VN')}đ</td>
                    <td style={{ padding: '12px' }}>{p.stockQuantity} sp</td>
                    <td style={{ padding: '12px' }}>
                      <button onClick={() => handleDeleteProduct(p.id)} className="btn btn-secondary" style={{ color: '#ef4444', padding: '4px 8px' }}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Danh Sách Đơn Hàng Khách Hàng</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((ord) => (
              <div key={ord.id} style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--primary-color)' }}>Đơn #{ord.id}</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '10px' }}>
                      Khách hàng: <strong>{ord.customerName}</strong> ({ord.customerPhone})
                    </span>
                  </div>
                  <div>
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                      style={{ padding: '6px 12px', borderRadius: '6px', background: '#0f172a', color: '#fff', border: '1px solid var(--border-bright)', fontWeight: 700 }}
                    >
                      <option value="PENDING">PENDING (Chờ Duyệt)</option>
                      <option value="PROCESSING">PROCESSING (Đóng Gói)</option>
                      <option value="SHIPPED">SHIPPED (Đang Giao)</option>
                      <option value="DELIVERED">DELIVERED (Thành Công)</option>
                      <option value="CANCELLED">CANCELLED (Đã Hủy)</option>
                    </select>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Địa chỉ: {ord.shippingAddress} | Phương thức: {ord.paymentMethod}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8' }}>
                  Tổng tiền: {ord.totalAmount?.toLocaleString('vi-VN')}đ
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form onSubmit={handleCreateProduct} className="glass-panel" style={{ width: '450px', padding: '28px', background: '#131722' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '16px' }}>Thêm Sản Phẩm Mới</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <input type="text" required placeholder="Tên sản phẩm" className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
              <textarea placeholder="Mô tả sản phẩm" className="input-field" value={description} onChange={(e) => setDescription(e.target.value)} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input type="number" placeholder="Giá bán (VND)" className="input-field" value={price} onChange={(e) => setPrice(e.target.value)} />
                <input type="number" placeholder="Giá gốc (VND)" className="input-field" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} />
              </div>
              <input type="text" placeholder="URL hình ảnh sản phẩm" className="input-field" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="ao-khoac">Áo Khoác</option>
                  <option value="ao-hoodie">Áo Hoodie</option>
                  <option value="ao-thun">Áo Thun</option>
                  <option value="quan-dai">Quần Dài</option>
                  <option value="vay-dam">Váy & Đầm</option>
                  <option value="phu-kien">Phụ Kiện</option>
                </select>
                <input type="number" placeholder="Số lượng kho" className="input-field" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Tạo Sản Phẩm</button>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary">Hủy</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
