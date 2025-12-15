import React, { useState } from 'react';
import { Minus, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useCart } from '../App';
import { Link } from 'react-router-dom';

export const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, placeOrder, cancelOrder, tableId } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    const id = placeOrder();
    if (id) {
        setPlacedOrderId(id);
        setIsSuccess(true);
    }
  };

  const handleCancelOrder = () => {
      if (placedOrderId) {
          if (window.confirm("Are you sure you want to cancel your order?")) {
              cancelOrder(placedOrderId);
              setPlacedOrderId(null);
              setIsSuccess(false);
          }
      }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-gray-50">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 shadow-lg shadow-green-100/50 animate-[bounce_1s_infinite]">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Order Sent!</h2>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm mb-8">
            <p className="text-gray-500 text-sm uppercase tracking-wide font-bold mb-2">Order For</p>
            <p className="text-2xl font-bold text-morocco-red mb-4">Table {tableId || 'Takeaway'}</p>
            <div className="h-px bg-gray-100 w-full mb-4"></div>
            <p className="text-gray-600 leading-relaxed text-sm">
              Your order is being prepared fresh. <br/>
              <span className="font-bold text-gray-900">Please pay at the counter</span> when you're ready.
            </p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-sm">
            <Link to="/" onClick={() => setIsSuccess(false)} className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-colors shadow-lg">
            Back to Match
            </Link>
            <button 
                onClick={handleCancelOrder}
                className="flex items-center justify-center text-red-500 py-3 rounded-2xl font-bold text-sm hover:bg-red-50 transition-colors"
            >
                <XCircle size={16} className="mr-2" />
                Cancel Order
            </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-6">
          <ShoppingBagIcon size={40} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/menu" className="bg-morocco-green text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-morocco-green/30">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold flex items-center">
        Order Summary
        {tableId && <span className="ml-auto text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Table {tableId}</span>}
      </h2>

      <div className="space-y-4">
        {cart.map(item => (
          <div key={item.id} className="flex items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100">
            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-gray-200" />
            <div className="ml-3 flex-1">
              <h3 className="font-bold text-sm text-gray-900">{item.name}</h3>
              <p className="text-morocco-green font-bold text-sm">{item.price * item.quantity} MAD</p>
            </div>
            
            <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-1">
              <button 
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 active:scale-95 transition-transform"
                disabled={item.quantity <= 1}
              >
                <Minus size={14} />
              </button>
              <span className="font-medium text-sm w-4 text-center">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 active:scale-95 transition-transform"
              >
                <Plus size={14} />
              </button>
            </div>
            <button 
                onClick={() => removeFromCart(item.id)}
                className="ml-3 text-gray-400 hover:text-red-500 transition-colors p-2"
            >
                <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{total} MAD</span>
        </div>
        <div className="flex justify-between font-bold text-xl text-gray-900 pt-2">
          <span>Total</span>
          <span>{total} MAD</span>
        </div>
      </div>

      <button 
        onClick={handleCheckout}
        className="w-full bg-morocco-red text-white py-4 rounded-xl font-bold shadow-lg shadow-red-200 active:scale-[0.98] transition-all flex justify-between px-6 items-center"
      >
        <span>Send Order</span>
        <span className="bg-red-800/30 px-2 py-1 rounded text-sm">{total} MAD</span>
      </button>
      <p className="text-center text-xs text-gray-400 mt-2">
        No payment required now. Pay at counter later.
      </p>
    </div>
  );
};

const ShoppingBagIcon = ({ size }: { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
);