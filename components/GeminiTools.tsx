import React, { useState, useRef } from 'react';
import { Camera, Wand2, Video, Loader2, Download, Image as ImageIcon, Send, Calendar, Clock } from 'lucide-react';
import { editFanImage, generateFanImage, generateFanVideo } from '../services/geminiService';
import { AspectRatio, ImageSize } from '../types';
import { useCart } from '../App';

type Mode = 'generate' | 'edit' | 'video' | 'schedule';

export const GeminiTools: React.FC = () => {
  const { matches } = useCart();
  const [mode, setMode] = useState<Mode>('generate');
  const [prompt, setPrompt] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [resultVideo, setResultVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Configs
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const checkApiKey = async () => {
    // Only needed for Pro models (Generate and Video)
    if (mode === 'generate' || mode === 'video') {
       if (window.aistudio && window.aistudio.hasSelectedApiKey) {
           const hasKey = await window.aistudio.hasSelectedApiKey();
           if (!hasKey) {
               await window.aistudio.openSelectKey();
               // Assume success after dialog interaction as per prompt instructions
               return true; 
           }
       }
    }
    return true;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
      setResultImage(null);
      setResultVideo(null);
    }
  };

  const handleSubmit = async () => {
    if (!prompt && mode === 'generate') return;
    if (!selectedImage && (mode === 'edit' || mode === 'video')) return;

    setLoading(true);
    setError(null);
    setResultImage(null);
    setResultVideo(null);

    try {
      await checkApiKey();

      if (mode === 'generate') {
        const result = await generateFanImage(prompt, imageSize);
        setResultImage(result);
      } else if (mode === 'edit') {
        // Edit uses Flash, no key selection popup needed usually unless strict environment, 
        // but service handles environment variable key.
        const result = await editFanImage(selectedImage!, prompt || "Enhance this image");
        setResultImage(result);
      } else if (mode === 'video') {
        const result = await generateFanVideo(selectedImage!, prompt, aspectRatio);
        setResultVideo(result);
      }
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes("Requested entity was not found")) {
         // Reset key logic if needed
         if(window.aistudio && window.aistudio.openSelectKey) {
             await window.aistudio.openSelectKey();
             setError("API Key issue resolved. Please try again.");
         } else {
             setError("API Key invalid. Please refresh.");
         }
      } else {
          setError(err.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-2 flex items-center text-morocco-red">
            <Wand2 className="mr-2" /> Fan Zone
        </h2>
        <p className="text-gray-600 mb-6 text-sm">
            Check the match schedule or create AFCON masterpieces with AI!
        </p>

        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6 overflow-x-auto">
          <button 
            onClick={() => { setMode('generate'); setError(null); }}
            className={`flex-1 py-2 px-2 text-xs md:text-sm font-bold rounded-lg transition-all whitespace-nowrap ${mode === 'generate' ? 'bg-white shadow text-morocco-red' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Create Art
          </button>
          <button 
            onClick={() => { setMode('edit'); setError(null); }}
            className={`flex-1 py-2 px-2 text-xs md:text-sm font-bold rounded-lg transition-all whitespace-nowrap ${mode === 'edit' ? 'bg-white shadow text-morocco-red' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Edit Photo
          </button>
          <button 
            onClick={() => { setMode('video'); setError(null); }}
            className={`flex-1 py-2 px-2 text-xs md:text-sm font-bold rounded-lg transition-all whitespace-nowrap ${mode === 'video' ? 'bg-white shadow text-morocco-red' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Animate
          </button>
           <button 
            onClick={() => { setMode('schedule'); setError(null); }}
            className={`flex-1 py-2 px-2 text-xs md:text-sm font-bold rounded-lg transition-all whitespace-nowrap ${mode === 'schedule' ? 'bg-white shadow text-morocco-red' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Schedule
          </button>
        </div>

        {/* Schedule Mode */}
        {mode === 'schedule' && (
             <div className="space-y-4">
                 <div className="flex items-center justify-between mb-2">
                     <h3 className="font-bold text-gray-900">AFCON 2025 Schedule</h3>
                     <span className="text-xs bg-morocco-green/10 text-morocco-green px-2 py-1 rounded-full font-bold">Group Stage</span>
                 </div>
                 {matches.length === 0 ? (
                     <div className="text-center py-6 text-gray-400 text-sm">Loading matches...</div>
                 ) : (
                     matches.map(match => (
                        <div key={match.id} className={`rounded-xl p-4 border ${match.status === 'live' ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-white'}`}>
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-gray-400" />
                                    <span className="text-xs font-bold text-gray-500 uppercase">{match.date}</span>
                                </div>
                                {match.status === 'live' ? (
                                    <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">LIVE</span>
                                ) : (
                                    <div className="flex items-center gap-1 text-gray-500">
                                        <Clock size={14} />
                                        <span className="text-xs font-bold">{match.time}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col items-center flex-1">
                                    <span className={`text-xs font-bold ${match.isMorocco ? 'text-morocco-red' : 'text-gray-900'}`}>{match.homeTeam}</span>
                                </div>
                                <div className="flex flex-col items-center flex-1 px-2">
                                    <span className="text-xl font-black text-gray-800">{match.score || 'VS'}</span>
                                </div>
                                <div className="flex flex-col items-center flex-1">
                                    <span className="text-xs font-bold text-gray-900">{match.awayTeam}</span>
                                </div>
                            </div>
                        </div>
                    ))
                 )}
             </div>
        )}

        {/* AI Controls */}
        {mode !== 'schedule' && (
        <div className="space-y-4">
          
          {(mode === 'edit' || mode === 'video') && (
            <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-morocco-green hover:bg-green-50 transition-colors h-48 relative overflow-hidden"
            >
                {selectedImage ? (
                    <img src={selectedImage} alt="Selected" className="absolute inset-0 w-full h-full object-contain bg-black/5" />
                ) : (
                    <>
                        <Camera size={32} className="mb-2" />
                        <span className="text-sm font-medium">Tap to upload photo</span>
                    </>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                {mode === 'generate' ? 'Describe your art' : mode === 'edit' ? 'How to change it?' : 'Animation prompt (Optional)'}
            </label>
            <div className="relative">
                <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={mode === 'generate' ? "A futuristic stadium in Casablanca..." : mode === 'edit' ? "Make it look like a vintage poster..." : "Slow motion celebration..."}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-morocco-red focus:border-transparent outline-none resize-none h-24"
                />
                <button 
                    onClick={handleSubmit} 
                    disabled={loading || (mode === 'generate' && !prompt) || ((mode === 'edit' || mode === 'video') && !selectedImage)}
                    className="absolute bottom-2 right-2 bg-morocco-green text-white p-2 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-800 transition-colors"
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
            </div>
          </div>

          {/* Configurations */}
          {mode === 'generate' && (
              <div className="flex gap-2">
                   {['1K', '2K', '4K'].map((s) => (
                       <button 
                        key={s}
                        onClick={() => setImageSize(s as ImageSize)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg border ${imageSize === s ? 'bg-morocco-red text-white border-morocco-red' : 'bg-white text-gray-500 border-gray-200'}`}
                       >
                           {s}
                       </button>
                   ))}
              </div>
          )}

          {mode === 'video' && (
               <div className="flex gap-2">
               {['16:9', '9:16'].map((r) => (
                   <button 
                    key={r}
                    onClick={() => setAspectRatio(r as AspectRatio)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border ${aspectRatio === r ? 'bg-morocco-red text-white border-morocco-red' : 'bg-white text-gray-500 border-gray-200'}`}
                   >
                       {r}
                   </button>
               ))}
          </div>
          )}
        </div>
        )}

        {/* Error */}
        {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
                {error}
                <div className="mt-2 text-[10px] text-gray-500">
                    Note: High-quality generation features require a valid API key selection.
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline ml-1">Learn more</a>
                </div>
            </div>
        )}

        {/* Results */}
        {(resultImage || resultVideo) && mode !== 'schedule' && (
            <div className="mt-6 border-t border-gray-100 pt-6">
                <h3 className="font-bold text-lg mb-3">Result</h3>
                <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100 bg-gray-50 relative group">
                    {resultImage && <img src={resultImage} alt="Generated" className="w-full h-auto" />}
                    {resultVideo && (
                        <video src={resultVideo} controls autoPlay loop className="w-full h-auto" />
                    )}
                    
                    <a 
                        href={resultImage || resultVideo || '#'} 
                        download={`atlas-lions-${Date.now()}.${resultVideo ? 'mp4' : 'png'}`}
                        className="absolute top-2 right-2 bg-white/90 p-2 rounded-full text-gray-800 shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <Download size={20} />
                    </a>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};
