import React, { useState } from 'react';
import { ShoppingBag, Heart, MessageSquare, User as UserIcon, Search, Shield, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useChat } from '../context/ChatContext';

export const Navbar = ({ onSearch, currentTab, setCurrentTab, setIsWishlistOpen }) => {
  const { user, isAdmin, logout, openAuthModal } = useAuth();
  const { getTotalCount, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const { setIsOpen: setIsChatOpen, messages } = useChat();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
    if (currentTab !== 'catalog') setCurrentTab('catalog');
  };

  return (
    <header className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 100, width: '100%' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentTab('home')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.4rem',
            color: '#fff',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
          }}>
            T
          </div>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.5px', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              TRENDS
            </span>
            <span style={{ fontSize: '0.7rem', display: 'block', color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '-4px' }}>
              CLOTHING STORE
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{ flex: 1, maxWidth: '420px', margin: '0 32px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Tìm kiếm áo khoác, hoodie, quần jeans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '42px', borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.05)' }}
            />
          </div>
        </form>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={() => setCurrentTab('home')}
            style={{
              background: 'none',
              border: 'none',
              color: currentTab === 'home' ? 'var(--primary-color)' : 'var(--text-main)',
              fontWeight: currentTab === 'home' ? 700 : 500,
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            Trang Chủ
          </button>
          
          <button
            onClick={() => setCurrentTab('catalog')}
            style={{
              background: 'none',
              border: 'none',
              color: currentTab === 'catalog' ? 'var(--primary-color)' : 'var(--text-main)',
              fontWeight: currentTab === 'catalog' ? 700 : 500,
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            Sản Phẩm
          </button>

          {user && (
            <button
              onClick={() => setCurrentTab('orders')}
              style={{
                background: 'none',
                border: 'none',
                color: currentTab === 'orders' ? 'var(--primary-color)' : 'var(--text-main)',
                fontWeight: currentTab === 'orders' ? 700 : 500,
                cursor: 'pointer',
                fontSize: '0.95rem'
              }}
            >
              Đơn Hàng
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => setCurrentTab('admin')}
              className="btn btn-outline"
              style={{ padding: '6px 12px', fontSize: '0.85rem', borderColor: '#a855f7', color: '#a855f7' }}
            >
              <LayoutDashboard size={16} /> Admin Panel
            </button>
          )}
        </nav>

        {/* Right Action Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '20px' }}>
          {/* Wishlist Icon */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="btn btn-secondary btn-icon"
            style={{ position: 'relative' }}
            title="Sản phẩm yêu thích"
          >
            <Heart size={20} color={wishlist.length > 0 ? '#ec4899' : 'currentColor'} fill={wishlist.length > 0 ? '#ec4899' : 'none'} />
            {wishlist.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ec4899',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 700,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="btn btn-primary btn-icon"
            style={{ position: 'relative' }}
            title="Giỏ hàng"
          >
            <ShoppingBag size={20} />
            {getTotalCount() > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 700,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {getTotalCount()}
              </span>
            )}
          </button>

          {/* Live Chat Launcher */}
          <button
            onClick={() => setIsChatOpen(true)}
            className="btn btn-secondary btn-icon"
            style={{ position: 'relative', borderColor: '#6366f1' }}
            title="Live Chat CSKH"
          >
            <MessageSquare size={20} color="#6366f1" />
            <span style={{
              position: 'absolute',
              bottom: '2px',
              right: '2px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#22c55e',
              border: '2px solid var(--bg-primary)'
            }} />
          </button>

          {/* User Auth Profile */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '8px', borderLeft: '1px solid var(--border-subtle)' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user.fullName || user.username}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.role === 'ROLE_ADMIN' ? 'Quản trị viên' : 'Khách hàng'}</div>
              </div>
              <button onClick={logout} className="btn btn-secondary btn-icon" title="Đăng xuất">
                <LogOut size={18} color="#ef4444" />
              </button>
            </div>
          ) : (
            <button onClick={() => openAuthModal('login')} className="btn btn-secondary" style={{ borderRadius: 'var(--radius-full)' }}>
              <UserIcon size={18} /> Đăng Nhập
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
