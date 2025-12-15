import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, PlayCircle, QrCode, UtensilsCrossed, CreditCard, Wand2, Timer, Flame } from 'lucide-react';
import { useCart } from '../App';

export const Home: React.FC = () => {
  const { matches } = useCart();
  // Get live match from dynamic state
  const liveMatch = matches.find(m => m.status === 'live') || matches[0];

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <div className="relative h-[450px] bg-gradient-to-br from-morocco-red to-red-900 text-white overflow-hidden rounded-b-[3rem] shadow-2xl mb-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40"></div>
        
        <div className="relative h-full flex flex-col justify-center items-center text-center p-6 max-w-4xl mx-auto mt-2">
          {liveMatch && liveMatch.status === 'live' && (
             <div className="animate-pulse inline-flex items-center gap-2 bg-red-600/90 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-bold mb-6 border border-red-500 shadow-lg shadow-red-900/50">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                LIVE: {liveMatch.homeTeam} vs {liveMatch.awayTeam}
             </div>
          )}
          
          <h2 className="text-4xl md:text-6xl font-black mb-4 leading-tight tracking-tight drop-shadow-xl">
            ORDER FROM YOUR SEAT.<br />
            ENJOY THE MATCH.<br />
            <span className="text-morocco-gold">NEVER MISS KICK-OFF.</span>
          </h2>
          <p className="text-white/90 text-sm md:text-lg max-w-md mb-8 font-light leading-relaxed">
            Live match times, smart ordering, and fast service — all from your phone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4">
             <Link to="/menu" className="bg-morocco-green hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-bold text-sm md:text-base flex items-center justify-center transition-all shadow-lg shadow-morocco-green/40 hover:scale-105 active:scale-95">
                Order Now <ChevronRight size={18} className="ml-2" />
             </Link>
             <Link to="/fan-zone" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold text-sm md:text-base flex items-center justify-center transition-all border border-white/20 hover:scale-105 active:scale-95">
                Match Schedule <Timer size={18} className="ml-2" />
             </Link>
          </div>
        </div>
      </div>

      {/* Live Match Card (Floating) */}
      <div className="px-6 mb-10 -mt-20 relative z-20">
          <div className="bg-white rounded-3xl p-1 shadow-xl shadow-black/10 border border-gray-100">
             <div className="bg-gray-50 rounded-[1.2rem] p-5 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Today's Highlight</span>
                    {liveMatch?.status === 'live' ? (
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-[10px] font-bold animate-pulse">🔴 LIVE {liveMatch.time}</span>
                    ) : (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold">{liveMatch?.time}</span>
                    )}
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex flex-col items-center w-1/3">
                        <span className="font-bold text-gray-900 text-sm">{liveMatch?.homeTeam}</span>
                    </div>
                    <div className="flex flex-col items-center w-1/3">
                        <span className="text-3xl font-black text-gray-900">{liveMatch?.score || 'VS'}</span>
                        <Link to="/menu" className="mt-2 text-[10px] bg-morocco-gold text-morocco-red px-3 py-1 rounded-full font-bold hover:bg-yellow-400">
                            Order Combo
                        </Link>
                    </div>
                    <div className="flex flex-col items-center w-1/3">
                        <span className="font-bold text-gray-900 text-sm">{liveMatch?.awayTeam}</span>
                    </div>
                </div>
             </div>
          </div>
      </div>

      {/* Categories Grid */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-900 flex items-center">
                <Flame size={20} className="text-orange-500 mr-2" />
                Match Cravings
            </h3>
            <Link to="/menu" className="text-xs font-bold text-morocco-red hover:underline">View Full Menu</Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <Link to="/menu" className="group relative h-40 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                <img src="https://picsum.photos/400/300?random=6" alt="Combos" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                    <span className="text-morocco-gold text-xs font-bold uppercase mb-1">Best Value</span>
                    <span className="text-white font-bold text-xl leading-none">Victory<br/>Combos</span>
                </div>
            </Link>
            <div className="flex flex-col gap-4">
                 <Link to="/menu" className="group relative h-full rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                    <img src="https://picsum.photos/400/300?random=1" alt="Drinks" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                        <span className="text-white font-bold text-lg">Drinks</span>
                    </div>
                </Link>
                 <Link to="/menu" className="group relative h-full rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                    <img src="https://picsum.photos/400/300?random=5" alt="Desserts" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                        <span className="text-white font-bold text-lg">Sweets</span>
                    </div>
                </Link>
            </div>
        </div>
      </div>

      {/* AI Promo */}
      <div className="px-6 pb-8">
          <div className="p-6 bg-morocco-green rounded-3xl text-white relative overflow-hidden shadow-xl shadow-morocco-green/30">
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="relative z-10">
                <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold mb-3 border border-white/20">
                    FAN ZONE
                </div>
                <h3 className="font-bold text-2xl mb-2 leading-tight">Win a Signed Jersey! 🇲🇦</h3>
                <p className="text-white/80 text-sm mb-6 leading-relaxed">
                    Use our AI tool to create your best celebration art. Post on Instagram with #AtlasLionsCafe.
                </p>
                <Link to="/fan-zone" className="inline-flex items-center bg-white text-morocco-green px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
                    Create Art Now <Wand2 size={16} className="ml-2" />
                </Link>
              </div>
          </div>
      </div>
    </div>
  );
};
