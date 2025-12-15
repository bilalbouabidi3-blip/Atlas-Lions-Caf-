import React, { useState } from 'react';
import { Plus, Timer } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { useCart } from '../App';
import { MenuItem } from '../types';

export const Menu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const { addToCart, menuItems, matches } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  const handleAdd = (item: MenuItem) => {
    addToCart(item);
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1000);
  };
  
  // Use matches from context
  const liveMatch = matches.find(m => m.status === 'live' || m.status === 'upcoming');

  return (
    <div className="pb-8">
      {/* Match Banner */}
      {liveMatch && (
        <div className="bg-gray-900 text-white p-3 flex justify-between items-center sticky top-0 z-50">
           <div className="flex items-center gap-2">
              <div className="bg-morocco-red p-1.5 rounded-lg animate-pulse">
                <Timer size={16} />
              </div>
              <div>
                 <p className="text-xs font-bold text-morocco-gold uppercase">
                    {liveMatch.status === 'live' ? 'Match is LIVE' : `Starts at ${liveMatch.time}`}
                 </p>
                 <p className="text-xs font-medium">Order now to avoid the rush!</p>
              </div>
           </div>
           {activeCategory !== 'combo' && (
               <button 
                onClick={() => setActiveCategory('combo')}
                className="bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full"
               >
                   View Combos
               </button>
           )}
        </div>
      )}

      {/* Category Filter */}
      <div className={`sticky ${liveMatch ? 'top-[52px]' : 'top-0'} bg-gray-50 z-40 py-2 pl-4 overflow-x-auto whitespace-nowrap scrollbar-hide border-b border-gray-200 transition-all`}>
        <div className="flex space-x-2 pr-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-morocco-red text-white shadow-md shadow-morocco-red/20 transform scale-105'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="p-4 grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex gap-4 transition-all hover:shadow-md">
            <div className="w-28 h-28 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden relative">
                <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                />
                {item.category === 'combo' && (
                    <div className="absolute top-0 left-0 bg-morocco-gold text-xs font-bold px-2 py-0.5 text-morocco-red">
                        Promo
                    </div>
                )}
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-900 leading-tight mb-1">{item.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
              </div>
              <div className="flex justify-between items-end mt-2">
                <span className="font-bold text-lg text-morocco-green">{item.price} <span className="text-xs">MAD</span></span>
                <button
                  onClick={() => handleAdd(item)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      addedId === item.id 
                      ? 'bg-green-500 text-white rotate-180' 
                      : 'bg-morocco-red text-white hover:bg-red-700'
                  }`}
                >
                  {addedId === item.id ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  ) : (
                      <Plus size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredItems.length === 0 && (
          <div className="text-center py-12 text-gray-400">
              <p>No items found in this category.</p>
          </div>
      )}
    </div>
  );
};
