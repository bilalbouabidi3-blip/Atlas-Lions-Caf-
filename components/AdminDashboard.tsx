import React, { useState } from 'react';
import { useCart } from '../App';
import { Clock, CheckCircle2, CircleDashed, Trash2, ChefHat, Plus, Sparkles, Loader2, Image as ImageIcon } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { MenuItem } from '../types';
import { generateFanImage } from '../services/geminiService';

export const AdminDashboard: React.FC = () => {
  const { orders, cancelOrder, menuItems, addMenuItem } = useCart();
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');
  
  // Menu Form State
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({ category: 'food' });
  const [generating, setGenerating] = useState(false);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'preparing': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
      switch(status) {
          case 'new': return <CircleDashed size={16} />;
          case 'preparing': return <Clock size={16} />;
          case 'completed': return <CheckCircle2 size={16} />;
          default: return null;
      }
  };

  const handleGenerateImage = async () => {
      if (!newItem.name || !newItem.description) {
          alert("Please enter a name and description first.");
          return;
      }

      setGenerating(true);
      try {
          // Check API Key first
          if (window.aistudio && window.aistudio.hasSelectedApiKey) {
              const has = await window.aistudio.hasSelectedApiKey();
              if (!has) await window.aistudio.openSelectKey();
          }

          const prompt = `Professional food photography of ${newItem.name}, ${newItem.description}, appetizing, 4k resolution, cinematic lighting, restaurant menu style.`;
          const base64 = await generateFanImage(prompt, '1K');
          setNewItem(prev => ({ ...prev, image: base64 }));
      } catch (e) {
          console.error(e);
          alert("Failed to generate image. Please check API Key.");
      } finally {
          setGenerating(false);
      }
  };

  const handleAddItem = () => {
      if (!newItem.name || !newItem.price || !newItem.image) {
          alert("Please fill all fields");
          return;
      }
      
      const item: MenuItem = {
          id: Date.now().toString(),
          name: newItem.name,
          description: newItem.description || '',
          price: Number(newItem.price),
          category: newItem.category as any || 'food',
          image: newItem.image
      };

      addMenuItem(item);
      setIsAdding(false);
      setNewItem({ category: 'food' });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
            <div className="bg-white p-1 rounded-lg border border-gray-200 flex">
                <button 
                    onClick={() => setActiveTab('orders')}
                    className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${activeTab === 'orders' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    Orders
                </button>
                <button 
                    onClick={() => setActiveTab('menu')}
                    className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${activeTab === 'menu' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    Menu Manager
                </button>
            </div>
        </div>
      </div>

      {activeTab === 'orders' ? (
          <>
            {orders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-400">No active orders.</p>
                </div>
            ) : (
                <div className="space-y-4">
                {[...orders].reverse().map(order => (
                    <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative group">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <span className="font-bold text-lg">Table {order.tableId}</span>
                            <span className="text-xs text-gray-500">#{order.id.slice(-4)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`px-2 py-1 rounded-md text-xs font-bold border flex items-center gap-1 ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="uppercase">{order.status}</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-4">
                        <ul className="space-y-2 mb-4">
                        {order.items.map(item => (
                            <li key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-600"><span className="font-bold text-gray-900">{item.quantity}x</span> {item.name}</span>
                            <span className="text-gray-400">{item.price * item.quantity} MAD</span>
                            </li>
                        ))}
                        </ul>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                            <span className="text-xs text-gray-400">{new Date(order.timestamp).toLocaleTimeString()}</span>
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-lg">{order.total} MAD</span>
                                <button 
                                    onClick={() => {
                                        if(window.confirm('Cancel this order?')) {
                                            cancelOrder(order.id);
                                        }
                                    }}
                                    className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-100 transition-colors border border-red-100"
                                    title="Cancel Order"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            )}
          </>
      ) : (
          <div className="space-y-6">
              {!isAdding ? (
                   <button 
                    onClick={() => setIsAdding(true)}
                    className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-500 hover:border-morocco-green hover:text-morocco-green hover:bg-green-50 transition-all font-bold"
                   >
                       <Plus size={20} className="mr-2" /> Add New Menu Item
                   </button>
              ) : (
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                      <h3 className="font-bold text-lg mb-4">Add New Item</h3>
                      <div className="space-y-4">
                          <div>
                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Item Name</label>
                              <input 
                                type="text" 
                                value={newItem.name || ''} 
                                onChange={e => setNewItem({...newItem, name: e.target.value})}
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                placeholder="e.g., Royal Couscous"
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Description</label>
                              <textarea 
                                value={newItem.description || ''} 
                                onChange={e => setNewItem({...newItem, description: e.target.value})}
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                placeholder="Describe ingredients..."
                                rows={2}
                              />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Price (MAD)</label>
                                <input 
                                    type="number" 
                                    value={newItem.price || ''} 
                                    onChange={e => setNewItem({...newItem, price: Number(e.target.value)})}
                                    className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Category</label>
                                <select 
                                    value={newItem.category}
                                    onChange={e => setNewItem({...newItem, category: e.target.value as any})}
                                    className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white"
                                >
                                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                                        <option key={c.id} value={c.id}>{c.label}</option>
                                    ))}
                                </select>
                              </div>
                          </div>
                          
                          <div>
                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Image URL or AI Generation</label>
                              <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={newItem.image || ''} 
                                    onChange={e => setNewItem({...newItem, image: e.target.value})}
                                    className="flex-1 p-2 border border-gray-200 rounded-lg text-sm"
                                    placeholder="https://..."
                                />
                                <button 
                                    onClick={handleGenerateImage}
                                    disabled={generating}
                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center hover:bg-purple-700 disabled:opacity-50"
                                >
                                    {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} className="mr-1" />}
                                    Generate AI
                                </button>
                              </div>
                              {newItem.image && (
                                  <div className="mt-2 h-32 w-full bg-gray-100 rounded-lg overflow-hidden">
                                      <img src={newItem.image} alt="Preview" className="w-full h-full object-cover" />
                                  </div>
                              )}
                          </div>

                          <div className="flex gap-2 pt-2">
                              <button onClick={() => setIsAdding(false)} className="flex-1 py-3 text-sm font-bold text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                              <button onClick={handleAddItem} className="flex-1 py-3 text-sm font-bold text-white bg-morocco-green rounded-lg hover:bg-green-700">Save Item</button>
                          </div>
                      </div>
                  </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menuItems.map(item => (
                      <div key={item.id} className="flex bg-white p-3 rounded-xl border border-gray-200 items-center">
                          <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                          <div className="ml-3 flex-1">
                              <h4 className="font-bold text-sm text-gray-900">{item.name}</h4>
                              <p className="text-xs text-gray-500">{item.price} MAD</p>
                          </div>
                          <span className="text-[10px] uppercase font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded">
                              {item.category}
                          </span>
                      </div>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};