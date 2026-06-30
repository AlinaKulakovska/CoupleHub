import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const MILESTONES = [
  { tier: 1, label: "First Step", icon: "🌱" },
  { tier: 2, label: "Committed", icon: "💕" },
  { tier: 3, label: "Power Couple", icon: "⚡" },
  { tier: 4, label: "Legends", icon: "🏆" }
];

const XP_PER_LEVEL = 150;

export default function CoupleChallenges() {
  const { user } = useContext(AuthContext);
  const coupleId = user?.couple?._id || user?.couple;

  const [challenges, setChallenges] = useState([]);
  const [progress, setProgress] = useState({ xp: 0, level: 1, completedChallenges: [] });
  const [loading, setLoading] = useState(true);
  
  // 👉 Form Expansion & Input States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newXp, setNewXp] = useState(50);
  const [newIcon, setNewIcon] = useState("🏆");

  useEffect(() => {
    if (coupleId) {
      fetch(`http://localhost:5000/api/challenges/${coupleId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.challenges) setChallenges(data.challenges);
          if (data.progress) setProgress(data.progress);
          setLoading(false);
        })
        .catch((err) => console.error(err));
    }
  }, [coupleId]);

  const handleComplete = async (challengeId) => {
    try {
      const response = await fetch("http://localhost:5000/api/challenges/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coupleId, challengeId }),
      });
      const updatedProgress = await response.json();
      if (response.ok) {
        setProgress(updatedProgress);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 👉 Handle custom challenge submission
  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    try {
      const response = await fetch("http://localhost:5000/api/challenges/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          xpReward: newXp,
          icon: newIcon
        }),
      });
      const createdChallenge = await response.json();
      if (response.ok) {
        setChallenges([...challenges, createdChallenge]);
        // Reset and collapse form fields
        setNewTitle("");
        setNewDescription("");
        setNewXp(50);
        setNewIcon("🏆");
        setIsFormOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Loading experience metrics...</div>;

  const currentLevelXp = progress.xp % XP_PER_LEVEL;
  const progressPercent = Math.min((currentLevelXp / XP_PER_LEVEL) * 100, 100);
  const featuredChallenge = challenges.find(c => !progress.completedChallenges.includes(c._id)) || challenges[0];

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 bg-[#FAF6F6] min-h-screen text-[#432C51]">
      {/* Title block */}
      <div>
        <div className="flex items-center gap-2 text-2xl font-bold">
          <span className="p-2 bg-pink-100 rounded-xl text-pink-500 text-sm">🏆</span>
          <h1>Couple Challenges</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Grow together, one challenge at a time.</p>
      </div>

      {/* Level & Milestones Card */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100/80 shadow-xs space-y-6">
        <div className="flex justify-between items-center text-sm font-bold text-gray-700">
          <span className="flex items-center gap-1.5 text-amber-600">⭐ Level {progress.level}</span>
          <span className="text-gray-400 font-medium">{currentLevelXp} / {XP_PER_LEVEL} XP</span>
        </div>
        <div className="w-full bg-purple-50 h-3 rounded-full overflow-hidden">
          <div style={{ width: `${progressPercent}%` }} className="bg-amber-500 h-full transition-all duration-500 ease-out" />
        </div>
        <div className="grid grid-cols-4 gap-2 pt-2">
          {MILESTONES.map((badge) => {
            const isUnlocked = progress.level >= badge.tier;
            return (
              <div key={badge.label} className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${isUnlocked ? "bg-amber-50 border-amber-200 text-amber-900 font-semibold" : "bg-white border-gray-50 text-gray-300"}`}>
                <span className={`text-xl mb-1 ${!isUnlocked && "grayscale opacity-40"}`}>{badge.icon}</span>
                <span className="text-[10px] md:text-xs tracking-tight leading-tight">{badge.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 👉 EXPANDABLE CUSTOM CHALLENGE BUTTON */}
      <button 
        onClick={() => setIsFormOpen(!isFormOpen)} 
        className="w-full py-3 bg-[#B06A82] text-white font-medium rounded-2xl hover:bg-[#96556C] transition shadow-xs flex items-center justify-center gap-2"
      >
        <span>{isFormOpen ? "✕ Close Form Container" : "＋ Create Custom Challenge"}</span>
      </button>

      {/* 👉 HIDDEN COLLAPSIBLE CHALLENGE FORM */}
      {isFormOpen && (
        <form onSubmit={handleCreateChallenge} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4 animate-fadeIn">
          <div>
            <label className="text-xs font-bold uppercase text-gray-400 block mb-1">Challenge Title</label>
            <input 
              type="text" placeholder="e.g. Cook dinner blindfolded..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2.5 outline-hidden text-sm text-gray-700 placeholder-gray-300"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-400 block mb-1">Description / Rules</label>
            <textarea 
              rows="2" placeholder="Describe how to earn this reward together..." value={newDescription} onChange={(e) => setNewDescription(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2.5 outline-hidden text-sm text-gray-700 placeholder-gray-300 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase text-gray-400 block mb-1">XP Value</label>
              <select value={newXp} onChange={(e) => setNewXp(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2.5 outline-hidden text-sm text-gray-700 cursor-pointer">
                <option value={25}>⭐ 25 XP</option>
                <option value={50}>⭐ 50 XP</option>
                <option value={75}>⭐ 75 XP</option>
                <option value={100}>⭐ 100 XP</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-400 block mb-1">Badge Icon</label>
              <select value={newIcon} onChange={(e) => setNewIcon(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2.5 outline-hidden text-sm text-gray-700 cursor-pointer">
                <option value="🏆">🏆 Trophy</option>
                <option value="🍳">🍳 Cooking</option>
                <option value="🎮">🎮 Gaming</option>
                <option value="🍿">🍿 Movie</option>
                <option value="✈️">✈️ Travel</option>
                <option value="💪">💪 Fitness</option>
              </select>
            </div>
          </div>

          <button className="w-full py-3 bg-[#B06A82] text-white rounded-2xl font-semibold text-sm hover:bg-[#96556C] transition shadow-xs">
            Save & Publish Challenge
          </button>
        </form>
      )}

      {/* Featured Big Card Showcase Layout */}
      {featuredChallenge && !progress.completedChallenges.includes(featuredChallenge._id) && (
        <div className="bg-[#FFF4F7] p-6 rounded-3xl border border-pink-100 shadow-xs space-y-4">
          <p className="text-xs text-pink-500 font-bold tracking-wider uppercase flex items-center gap-1">⏱️ 🔥 Featured Challenge</p>
          <div className="space-y-2">
            <span className="text-3xl p-2.5 bg-white rounded-2xl inline-block shadow-xs border border-pink-50">{featuredChallenge.icon}</span>
            <h2 className="text-xl font-bold font-serif text-gray-800 mt-2">{featuredChallenge.title}</h2>
            <p className="text-sm text-gray-500 leading-relaxed">{featuredChallenge.description}</p>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-bold text-amber-600 flex items-center gap-1">⭐ {featuredChallenge.xpReward} XP</span>
            <button onClick={() => handleComplete(featuredChallenge._id)} className="px-5 py-2.5 bg-[#B06A82] text-white text-xs font-semibold rounded-full hover:bg-[#96556C] transition shadow-xs">Mark Complete ✓</button>
          </div>
        </div>
      )}

      {/* Full Quests Scroll Feed List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider px-1">All Available Quests</h3>
        {challenges.map((challenge) => {
          const isDone = progress.completedChallenges.includes(challenge._id);
          return (
            <div key={challenge._id} className={`flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100/70 shadow-xs transition-all ${isDone ? "opacity-55 bg-gray-50/50" : ""}`}>
              <div className="flex items-center gap-3.5">
                <span className="text-xl p-2 bg-gray-50 rounded-xl block shrink-0">{challenge.icon}</span>
                <div>
                  <p className={`font-semibold text-sm md:text-base text-gray-800 ${isDone ? "line-through text-gray-400" : ""}`}>{challenge.title}</p>
                  <p className="text-[11px] text-amber-600 font-medium mt-0.5">⭐ {challenge.xpReward} XP</p>
                </div>
              </div>
              <button
                type="button" disabled={isDone} onClick={() => handleComplete(challenge._id)}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition border shrink-0 ${isDone ? "bg-emerald-500 border-emerald-500 text-white text-xs font-bold" : "border-gray-200 bg-white hover:border-pink-300"}`}
              >
                {isDone ? "✓" : ""}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}