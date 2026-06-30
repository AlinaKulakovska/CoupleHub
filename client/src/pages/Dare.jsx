import { useState } from "react";

export default function Dare() {
  const [mode, setMode] = useState("truth"); // "truth" or "dare"
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const drawCard = async () => {
    setLoading(true);
    setIsAnimating(true);
    setPrompt(null);

    // Dynamic endpoint target selection based on active tab state
    const apiEndpoint = mode === "truth" 
      ? "https://api.truthordarebot.xyz/v1/truth" 
      : "https://api.truthordarebot.xyz/api/dare";

    try {
      const response = await fetch(apiEndpoint);
      const data = await response.json();
      
      // Delay slightly for visual pacing and deck shuffling feel
      setTimeout(() => {
        // The bot API payload maps the text to data.question
        setPrompt(data.question || data.text); 
        setLoading(false);
        setIsAnimating(false);
      }, 600);
    } catch (err) {
      console.error("Game engine connection error:", err);
      setPrompt("Oops! Failed to connect to game servers. Try drawing again.");
      setLoading(false);
      setIsAnimating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6 bg-[#FAF6F6] min-h-screen text-[#432C51]">
      
      {/* Title Header Section */}
      <div>
        <div className="flex items-center gap-2 text-2xl font-bold">
          <span className="p-2 bg-pink-100 rounded-xl text-pink-500 text-sm">🎲</span>
          <h1>Truth or Dare</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Roll the dice on your relationship.</p>
      </div>

      {/* Dual Segment Toggle Switcher Selector Frame Options */}
      <div className="bg-white p-1 rounded-2xl border border-gray-100 flex items-center shadow-xs">
        <button
          onClick={() => { setMode("truth"); setPrompt(null); }}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer
            ${mode === "truth" 
              ? "bg-[#B06A82] text-white shadow-sm" 
              : "text-gray-400 hover:text-gray-600"
            }`}
        >
          <span>🤔</span> Truth
        </button>
        <button
          onClick={() => { setMode("dare"); setPrompt(null); }}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer
            ${mode === "dare" 
              ? "bg-[#B06A82] text-white shadow-sm" 
              : "text-gray-400 hover:text-gray-600"
            }`}
        >
          <span>🎲</span> Dare
        </button>
      </div>

      {/* Main Interactive Center Stage Canvas Card Box Slot */}
      <div className="bg-white min-h-[280px] rounded-3xl border border-gray-100/80 shadow-xs p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
        
        {isAnimating ? (
          /* Shuffling State Wheel indicator */
          <div className="space-y-3 animate-pulse">
            <span className="text-4xl block animate-spin">🌸</span>
            <p className="text-xs text-gray-400 font-medium tracking-widest uppercase">Fetching next prompt...</p>
          </div>
        ) : prompt ? (
          /* Card Revealed Screen Layout Pane */
          <div className="space-y-4 animate-scaleUp max-w-md">
            <span className="text-3xl p-3 bg-[#FFF4F7] rounded-2xl inline-block border border-pink-50">
              {mode === "truth" ? "🤔" : "⚡"}
            </span>
            <p className="text-lg md:text-xl font-medium font-serif leading-relaxed text-gray-800 px-2">
              {prompt}
            </p>
          </div>
        ) : (
          /* Fresh Undrawn Idle State UI Layout Block */
          <button 
            onClick={drawCard}
            className="group flex flex-col items-center justify-center space-y-3 p-6 focus:outline-hidden cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#FFF4F7] border border-pink-100 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform duration-300 shadow-xs">
              🌸
            </div>
            <span className="text-sm font-medium text-gray-400 group-hover:text-gray-600 transition">
              Draw a card
            </span>
          </button>
        )}
      </div>

      {/* Bottom Structural Form drawing Activation CTA Button Wrapper */}
      <button
        onClick={drawCard}
        disabled={loading}
        className="w-full py-4 bg-[#B06A82] hover:bg-[#96556C] disabled:opacity-50 text-white font-semibold rounded-2xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm md:text-base cursor-pointer"
      >
        <span>🎲</span>
        {prompt ? `Draw another ${mode === "truth" ? "Truth" : "Dare"}` : `Draw a ${mode === "truth" ? "Truth" : "Dare"}`}
      </button>

    </div>
  );
}