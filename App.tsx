import React, { createContext, useContext, useEffect, useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Menu } from './components/Menu';
import { Cart } from './components/Cart';
import { AdminDashboard } from './components/AdminDashboard';
import { GeminiTools } from './components/GeminiTools';
import { MenuItem, CartItem, Order, Match, CartContextType } from './types'; // Import CartContextType
import { MENU_ITEMS } from './constants';
import { fetchMatches } from './services/matchService';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

// Route Listener component to handle QR code hashes like #/table/123
const TableDetector: React.FC = () => {
  const location = useLocation();
  const { setTableId } = useCart();

  useEffect(() => {
    // Simple logic: if path starts with /table/, extract ID
    if (location.pathname.startsWith('/table/')) {
        const id = location.pathname.split('/')[2];
        if (id) {
            setTableId(id);
        }
    }
  }, [location, setTableId]);

  return null;
};

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tableId, setTableId] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [matches, setMatches] = useState<Match[]>([]);

  // Fetch matches on mount (Simulating Firebase connection)
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchMatches();
        setMatches(data);
      } catch (error) {
        console.error("Failed to fetch matches:", error);
      }
    };

    loadData();

    // Poll for live updates every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const placeOrder = () => {
    if (cart.length === 0) return null;
    
    const id = Math.random().toString(36).substr(2, 9);
    const newOrder: Order = {
      id,
      tableId: tableId || 'Takeaway',
      items: [...cart],
      total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
      status: 'new',
      timestamp: Date.now(),
    };

    setOrders(prev => [...prev, newOrder]);
    setCart([]); // Clear cart
    return id;
  };

  const cancelOrder = (id: string) => {
    setOrders(prev => prev.filter(order => order.id !== id));
  };

  const addMenuItem = (item: MenuItem) => {
    setMenuItems(prev => [...prev, item]);
  };

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQuantity, 
      placeOrder, cancelOrder, orders, tableId, setTableId,
      menuItems, addMenuItem, matches
    }}>
      <HashRouter>
        <TableDetector />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/fan-zone" element={<GeminiTools />} />
            
            {/* Redirect /table/:id to menu after capturing ID via TableDetector */}
            <Route path="/table/:id" element={<Menu />} />
          </Routes>
        </Layout>
      </HashRouter>
    </CartContext.Provider>
  );
};

export default App;
