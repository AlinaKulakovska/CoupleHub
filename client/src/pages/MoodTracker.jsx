import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const MOOD_OPTIONS = [
  { emoji: "💖", label: "Loving", color: "bg-pink-100 text-pink-700 border-pink-200" },
  { emoji: "😊", label: "Happy", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { emoji: "😴", label: "Tired", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { emoji: "🥺", label: "Needy", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  { emoji: "😤", label: "Stressed", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { emoji: "😔", label: "Sad", color: "bg-gray-100 text-gray-700 border-gray-200" },
];

export default function MoodTracker() {
  const { user } = useContext(AuthContext);
  const coupleId = user?.couple?._id || user?.couple;
  const loggedInUserId = user?.id || user?._id;

  const [myMood, setMyMood] = useState(null);
  const [partnerMood, setPartnerMood] = useState(null);

  useEffect(() => {
    if (!coupleId) return;
    fetch(`http://localhost:5000/api/moods/${coupleId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const mine = data.find((m) => String(m.user) === String(loggedInUserId));
          const theirs = data.find((m) => String(m.user) !== String(loggedInUserId));
          if (mine) setMyMood(mine);
          if (theirs) setPartnerMood(theirs);
        }
      })
      .catch((err) => console.error(err));
  }, [coupleId, loggedInUserId]);

  const handleSelectMood = async (option) => {
    try {
      const response = await fetch("http://localhost:5000/api/moods/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coupleId,
          userId: loggedInUserId,
          ...option,
        }),
      });
      const data = await response.json();
      if (response.ok) setMyMood(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8 min-h-screen bg-gray-50/50">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">✨ Mood Check-in</h1>
        <p className="text-gray-400 text-sm">Share how you're feeling right now with your partner.</p>
      </div>

      {/* Partner Status Display */}
      <div className="bg-white p-6 rounded-3xl shadow-xs border border-gray-100 text-center space-y-3">
        <p className="text-sm font-semibold text-pink-500 uppercase tracking-wider">Partner's Current Mood</p>
        {partnerMood ? (
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full border text-lg font-bold ${partnerMood.color}`}>
            <span>{partnerMood.emoji}</span>
            <span>{partnerMood.label}</span>
          </div>
        ) : (
          <p className="text-gray-400 text-sm italic">Your partner hasn't checked in today yet.</p>
        )}
      </div>

      {/* Interactive Selection Grid */}
      <div className="bg-white p-6 rounded-3xl shadow-xs border border-gray-100 space-y-4">
        <p className="text-sm font-semibold text-gray-700 text-center">How are you feeling, {user?.name}?</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {MOOD_OPTIONS.map((opt) => {
            const isSelected = myMood?.label === opt.label;
            return (
              <button
                key={opt.label}
                onClick={() => handleSelectMood(opt)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all hover:scale-102 ${
                  isSelected ? `${opt.color} shadow-sm ring-2 ring-offset-2 ring-pink-300` : "bg-gray-50/50 border-gray-100 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="text-3xl mb-1">{opt.emoji}</span>
                <span className="text-sm font-medium">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}