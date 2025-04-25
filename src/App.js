import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';


const initialProducts = [
  { id: 1, name: 'تفاح', price: 3.5, image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80', desc: 'تفاح طازج عالي الجودة.' },
  { id: 2, name: 'موز', price: 2.0, image: 'https://images.unsplash.com/photo-1574226516831-e1dff420e16d?auto=format&fit=crop&w=400&q=80', desc: 'موز مستورد طازج.' },
  { id: 3, name: 'خبز', price: 1.5, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80', desc: 'خبز مخبوز يومياً.' },
  { id: 4, name: 'حليب', price: 4.0, image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80', desc: 'حليب طبيعي 100%.' }
];

function App() {
  // تحميل المنتجات من localStorage إذا وجدت
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : initialProducts;
  });
  // تحميل السلة من localStorage إذا وجدت
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState([]);

  // دالة لإضافة منتج جديد
  const addProduct = (product) => {
    setProducts(prev => {
      const updated = [
        { ...product, id: Date.now() },
        ...prev
      ];
      localStorage.setItem('products', JSON.stringify(updated));
      return updated;
    });
  };

  // دالة لتعديل منتج
  const updateProduct = (updated) => {
    setProducts(prev => {
      const updatedProducts = prev.map(p => p.id === updated.id ? { ...p, ...updated } : p);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  };

  // دالة حذف منتج
  const deleteProduct = (id) => {
    setProducts(prev => {
      const filtered = prev.filter(p => p.id !== id);
      localStorage.setItem('products', JSON.stringify(filtered));
      return filtered;
    });
  };



  // دالة لإضافة منتج للسلة
  const addToCart = (product) => {
    setCart(prev => {
      const found = prev.find(item => item.id === product.id);
      let updated;
      if (found) {
        updated = prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      } else {
        updated = [...prev, { ...product, qty: 1 }];
      }
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  // زيادة كمية منتج في السلة
  const increaseQty = (id) => {
    setCart(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item);
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  // تقليل كمية منتج في السلة
  const decreaseQty = (id) => {
    setCart(prev => {
      const updated = prev.map(item => item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item);
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  // إزالة منتج من السلة
  const removeFromCart = (id) => {
    setCart(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  // دالة لتفريغ السلة
  const clearCart = () => setCart([]);

  return (
    <Router>
      <Navbar cartCount={cart.reduce((sum, item) => sum + item.qty, 0)} />
      <Routes>
        <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
        <Route path="/product/:id" element={<ProductDetails products={products} addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} increaseQty={increaseQty} decreaseQty={decreaseQty} removeFromCart={removeFromCart} />} />
        <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} setOrders={setOrders} />} />
        <Route path="/dashboard" element={<Dashboard addProduct={addProduct} products={products} updateProduct={updateProduct} deleteProduct={deleteProduct} orders={orders} setOrders={setOrders} />} />
      </Routes>
    </Router>
  );
}

export default App;
