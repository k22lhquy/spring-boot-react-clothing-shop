import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ChatProvider } from './context/ChatContext';

import { RateLimitBanner } from './components/RateLimitBanner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { AdminDashboard } from './pages/AdminDashboard';

import { ProductDetailModal } from './components/ProductDetailModal';
import { WishlistModal } from './components/WishlistModal';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { LiveChatWidget } from './components/LiveChatWidget';

function ShopApp() {
  const [currentTab, setCurrentTab] = useState('home');
  const [catalogCategory, setCatalogCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const handleNavigateCatalog = (catSlug) => {
    setCatalogCategory(catSlug || 'all');
    setCurrentTab('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentTab('catalog');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Anti-DDoS Rate Limit Alert */}
      <RateLimitBanner />

      {/* Main Navigation Header */}
      <Navbar
        onSearch={handleSearch}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        setIsWishlistOpen={setIsWishlistOpen}
      />

      {/* Page Content Container */}
      <div style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '32px 24px 0 24px' }}>
        {currentTab === 'home' && (
          <Home
            onNavigateCatalog={handleNavigateCatalog}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {currentTab === 'catalog' && (
          <Catalog
            initialCategory={catalogCategory}
            searchQuery={searchQuery}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {currentTab === 'checkout' && (
          <CheckoutPage
            onNavigateBack={() => setCurrentTab('catalog')}
            onOrderSuccess={(orderData) => {
              setCurrentTab('orders');
            }}
          />
        )}

        {currentTab === 'orders' && <OrdersPage />}

        {currentTab === 'admin' && <AdminDashboard />}
      </div>

      {/* Overlays & Modals */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />

      <AuthModal />

      <CartDrawer
        onProceedToCheckout={() => setCurrentTab('checkout')}
      />

      <LiveChatWidget />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ChatProvider>
            <ShopApp />
          </ChatProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
