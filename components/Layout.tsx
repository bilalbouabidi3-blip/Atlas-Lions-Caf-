import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Coffee, ShoppingBag, Wand2, ShieldCheck, User } from 'lucide-react';
import { useCart } from '../App';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { cart, tableId } = useCart();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path ? "text-morocco-red" : "text-gray-500";

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-morocco-red text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <Link to="/" className="flex items-center space-x-2">
             <div className="bg-white p-1 rounded-full">
                <ShieldCheck size={24} className="text-morocco-green" />
             </div>
             <div>
               <h1 className="font-bold text-lg leading-tight">Atlas Lions</h1>
               <p className="text-xs text-morocco-gold opacity-90">AFCON 2025</p>
             </div>
          </Link>
          
          {tableId && (
            <div className="bg-morocco-green/90 px-3 py-1 rounded-full text-xs font-medium border border-morocco-gold/30">
              Table {tableId}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto flex justify-around items-center">
          <Link to="/" className={`flex flex-col items-center p-2 ${isActive('/')}`}>
            <Home size={22} />
            <span className="text-[10px] mt-1 font-medium">Home</span>
          </Link>
          
          <Link to="/menu" className={`flex flex-col items-center p-2 ${isActive('/menu')}`}>
            <Coffee size={22} />
            <span className="text-[10px] mt-1 font-medium">Menu</span>
          </Link>

          <Link to="/fan-zone" className={`flex flex-col items-center p-2 ${isActive('/fan-zone')}`}>
            <Wand2 size={22} />
            <span className="text-[10px] mt-1 font-medium">Fan Zone</span>
          </Link>

          <Link to="/cart" className={`flex flex-col items-center p-2 relative ${isActive('/cart')}`}>
            <div className="relative">
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-morocco-green text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 font-medium">Order</span>
          </Link>
          
          <Link to="/admin" className={`flex flex-col items-center p-2 ${isActive('/admin')}`}>
            <User size={22} />
            <span className="text-[10px] mt-1 font-medium">Staff</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};