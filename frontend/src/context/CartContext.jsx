import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('shop_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('shop_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, selectedSize = 'M', selectedColor = '', quantity = 1) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.productId === product.id && item.size === selectedSize && item.color === selectedColor
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            productId: product.id,
            productName: product.name,
            productImage: product.images[0] || '',
            unitPrice: product.price,
            size: selectedSize,
            color: selectedColor || (product.colors?.[0] || 'Default'),
            quantity,
          },
        ];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, delta) => {
    setCartItems((prev) => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedVoucher(null);
  };

  const applyVoucherCode = async (code) => {
    const subtotal = getSubtotal();
    const res = await apiFetch(`/vouchers/validate?code=${encodeURIComponent(code)}&orderAmount=${subtotal}`);
    if (res.success && res.data) {
      setAppliedVoucher(res.data);
      return res.data;
    }
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
  };

  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  };

  const getDiscountAmount = () => {
    if (!appliedVoucher) return 0;
    const subtotal = getSubtotal();
    if (subtotal < appliedVoucher.minOrderAmount) return 0;
    
    let discount = (subtotal * appliedVoucher.discountPercent) / 100;
    if (appliedVoucher.maxDiscount > 0 && discount > appliedVoucher.maxDiscount) {
      discount = appliedVoucher.maxDiscount;
    }
    return discount;
  };

  const getTotalPrice = () => {
    return Math.max(0, getSubtotal() - getDiscountAmount());
  };

  const getTotalCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        appliedVoucher,
        applyVoucherCode,
        removeVoucher,
        getSubtotal,
        getDiscountAmount,
        getTotalPrice,
        getTotalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
