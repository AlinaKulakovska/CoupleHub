import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Dates() {
  const { user } = useContext(AuthContext);
  
  // Dynamic user name resolution for Turn Indicator Row tabs
  const coupleData = user?.couple;
  const isUser1 = String(user?.id || user?._id) === String(coupleData?.user1?._id || coupleData?.user1);
  const userName = user?.name || "Alex";
  const partnerName = (isUser1 ? coupleData?.user2?.name : coupleData?.user1?.name) || "Sam";

  // State Management
  const [currentActivity, setCurrentActivity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTurn, setActiveTurn] = useState("Alex"); // Tracks whose dashboard UI turn it is
  const [matchedActivity, setMatchedActivity] = useState(null);

  // Keep a tracking log of right-swiped activity names for both users
  const [swipedLikes, setSwipedLikes] = useState({
    Alex: new Set(),
    Sam: new Set()
  });

  // Fetch a random live activity from the provided REST API
  const fetchNextActivity = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://radiant-caverns-24681.herokuapp.com/api/activities");
      const data = await response.json();
      
      // Expected payload format: { activity_name: "Movie Marathon", ... } or fallback to properties
      setCurrentActivity({
        title: data.activity_name || data.name || "Surprise Date Activity",
        cost: data.cost || "Free",
        location: data.location || "Flexible Location",
        category: data.category || "General",
        // Using high-quality placeholder image for visual appeal
        image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800"
      });
    } catch (err) {
      console.error("API Fetch Error:", err);
      // Fallback display card if the Heroku server is asleep/spinning up
      setCurrentActivity({
        title: "Movie Marathon",
        cost: "Free",
        location: "At Home",
        category: "At-home",
        image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800"
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial loading trigger hook
  useEffect(() => {
    fetchNextActivity();
  }, []);

  const handleSwipe = (liked) => {
    if (!currentActivity) return;

    const activityName = currentActivity.title;

    if (liked) {
      // Add the liked item to the active profile's set tracker
      swipedLikes[activeTurn].add(activityName);
      setSwipedLikes({ ...swipedLikes });

      // Check if BOTH profiles now match on this activity name string
      if (swipedLikes.Alex.has(activityName) && swipedLikes.Sam.has(activityName)) {
        setMatchedActivity(currentActivity);
        return;
      }
    }

    // Advance clean view state forward by querying a fresh index item card
    fetchNextActivity();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6 bg-[#FAF6F6] min-h-screen text-[#432C51] relative">
      
      {/* Title Header Section */}
      <div>
        <div className="flex items-center gap-2 text-2xl font-bold">
          <span className="text-pink-500">❤️</span>
          <h1>Date Matcher</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Swipe right on dates you'd both love.</p>
      </div>

      {/* 1. Turn Switcher Control Navigation Header Row */}
      <div className="bg-white p-1 rounded-2xl border border-gray-100 flex items-center shadow-xs">
        <button
          onClick={() => setActiveTurn("Alex")}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer
            ${activeTurn === "Alex" ? "bg-[#B06A82] text-white shadow-xs" : "text-gray-400"}`}
        >
          <span>🧑‍🎨</span> {userName}'s Turn
        </button>
        <button
          onClick={() => setActiveTurn("Sam")}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer
            ${activeTurn === "Sam" ? "bg-[#B06A82] text-white shadow-xs" : "text-gray-400"}`}
        >
          <span>🧑‍🚀</span> {partnerName}'s Turn
        </button>
      </div>

      {/* 2. Main Swiper Card Box View Canvas Frame */}
      {loading ? (
        <div className="bg-white rounded-3xl min-h-[400px] border border-gray-100 shadow-xs flex flex-col items-center justify-center p-8 text-center space-y-3">
          <span className="text-4xl animate-spin block">🌸</span>
          <p className="text-xs text-gray-400 font-medium tracking-widest uppercase">Streaming live activity ideas...</p>
        </div>
      ) : currentActivity ? (
        <div className="bg-white rounded-3xl border border-gray-100/70 shadow-xs overflow-hidden transition-all duration-300">
          
          {/* Card Visual Image Wrapper Panel */}
          <div className="relative h-64 md:h-72 w-full bg-gray-100">
            <img 
              src={currentActivity.image} 
              alt={currentActivity.title} 
              className="w-full h-full object-cover"
            />
            {/* Category Tag Overlay Badge */}
            <span className="absolute bottom-4 left-4 px-3 py-1 bg-black/40 text-white backdrop-blur-xs rounded-lg text-xs font-medium uppercase tracking-wider">
              {currentActivity.category}
            </span>
          </div>

          {/* Description Text Details Section */}
          <div className="p-6 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl font-bold font-serif text-gray-800 leading-snug">
                {currentActivity.title}
              </h2>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-md text-xs font-bold shrink-0">
                {currentActivity.cost}
              </span>
            </div>
            
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              Let's head out and enjoy this random date activity generated private for the two of you.
            </p>
            
            <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-1">
              <span>📍</span>
              <span>{currentActivity.location}</span>
            </div>
          </div>

          {/* 3. Swipe Action Control Triggers Panel Footer */}
          <div className="p-4 border-t border-gray-50 flex items-center justify-center gap-8 bg-gray-50/50">
            <button 
              onClick={() => handleSwipe(false)}
              className="w-12 h-12 rounded-full bg-white border border-red-100 flex items-center justify-center text-red-400 font-bold hover:bg-red-50 shadow-xs transition active:scale-95 cursor-pointer"
            >
              ✕
            </button>
            
            <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">
              Swipe Pool Idea
            </span>

            <button 
              onClick={() => handleSwipe(true)}
              className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white text-lg font-bold hover:bg-emerald-600 shadow-md transition active:scale-95 cursor-pointer"
            >
              ❤️
            </button>
          </div>

        </div>
      ) : null}

      {/* 4. MATCH LIGHTBOX MODAL OVERLAY CELEBRATION WINDOW */}
      {matchedActivity && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-pink-100 transform scale-100 animate-scaleUp">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center text-2xl mx-auto animate-bounce">
              🎉
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-serif text-gray-800">It's a Match!</h3>
              <p className="text-xs text-gray-400">Both users swiped right on this activity item!</p>
            </div>
            
            <div className="p-4 bg-[#FFF4F7] rounded-2xl border border-pink-50">
              <h4 className="font-bold text-sm text-pink-700">{matchedActivity.title}</h4>
              <p className="text-xs text-gray-500 mt-1">Location target: {matchedActivity.location}</p>
            </div>

            <button 
              onClick={() => { setMatchedActivity(null); fetchNextActivity(); }}
              className="w-full py-2.5 bg-[#B06A82] text-white rounded-xl text-xs font-bold hover:bg-[#96556C] transition shadow-xs cursor-pointer"
            >
              Lock It In & Keep Matching
            </button>
          </div>
        </div>
      )}

    </div>
  );
}