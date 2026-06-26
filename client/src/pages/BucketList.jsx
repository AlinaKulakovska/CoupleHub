import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Plus } from "lucide-react";

const CATEGORIES = [
  { name: "Travel", icon: "✈️" },
  { name: "Food", icon: "🍽️" },
  { name: "Movies", icon: "🎬" },
  { name: "Adventures", icon: "🏔️" },
];

export default function BucketList() {
  const { user } = useContext(AuthContext);
  const coupleId = user?.couple?._id || user?.couple;
  const loggedInUserId = user?.id || user?._id;

  const [items, setItems] = useState([]);
  const [newDream, setNewDream] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Adventures");
  const [activeFilter, setActiveFilter] = useState("All");

  // Fetch items from database on component mount
  useEffect(() => {
    if (coupleId) {
      fetch(`http://localhost:5000/api/bucket-list/${coupleId}`)
        .then((res) => res.json())
        .then((data) => setItems(Array.isArray(data) ? data : []))
        .catch((err) => console.error(err));
    }
  }, [coupleId]);

  // Handle adding an item
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newDream.trim()) return;

    try {
      const response = await fetch("http://localhost:5000/api/bucket-list/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coupleId,
          title: newDream,
          category: selectedCategory,
          userId: loggedInUserId,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setItems([data, ...items]);
        setNewDream("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle checking off an item
  const handleToggleItem = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bucket-list/toggle/${id}`, {
        method: "PATCH",
      });
      if (response.ok) {
        setItems(items.map(item => item._id === id ? { ...item, isCompleted: !item.isCompleted } : item));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Progress Bar Variables calculation
  const completedCount = items.filter((item) => item.isCompleted).length;
  const totalCount = items.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filter items matching active chip select status
  const filteredItems = items.filter((item) => activeFilter === "All" || item.category === activeFilter);

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6  min-h-screen">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-2xl font-bold text-[#432C51]">
          <span className="p-2 bg-pink-100 rounded-xl text-pink-500 text-sm">📝</span>
          <h1>Bucket List</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Goals to tick off, memories to make.</p>
      </div>

      {/* Progress Card */}
      <div className="bg-white p-6 rounded-3xl shadow-xs border border-pink-50/50">
        <div className="flex justify-between items-center text-sm font-semibold text-[#432C51] mb-2">
          <span>{completedCount} of {totalCount} completed</span>
          <span className="text-pink-500">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-pink-50 h-3 rounded-full overflow-hidden">
          <div 
            className="bg-linear-to-r from-pink-400 to-purple-400 h-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Entry Input Form */}
      <form onSubmit={handleAddItem} className="bg-white p-3 rounded-3xl shadow-xs flex items-center gap-3 border border-gray-100">
        <input
          type="text"
          placeholder="Add a new dream..."
          value={newDream}
          onChange={(e) => setNewDream(e.target.value)}
          className="flex-1 bg-transparent px-4 py-2 outline-hidden text-gray-700 placeholder-gray-300"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-pink-50 text-pink-500 px-4 py-2 rounded-2xl text-sm font-medium outline-hidden cursor-pointer border border-transparent hover:border-purple-200"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.name} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <button className="bg-pink-500 hover:bg-pink-700 transition text-white  p-2 rounded-2xl flex items-center justify-center aspect-square">
          <Plus size={24} />
        </button>
      </form>

      {/* Filter Category Chips Row */}
      <div className="flex gap-2 items-center overflow-x-auto pb-1">
        <button
          onClick={() => setActiveFilter("All")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            activeFilter === "All" ? "bg-pink-500 text-white shadow-xs" : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveFilter(cat.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition ${
              activeFilter === cat.name ? "bg-pink-500 text-white shadow-xs" : "bg-purple-50/60 text-[#432C51] hover:bg-purple-50"
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Dynamic Item Cards Stack */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isCreator = String(item.createdBy) === String(loggedInUserId);
          const icon = CATEGORIES.find(c => c.name === item.category)?.icon || "✨";

          return (
            <div
              key={item._id}
              className={`flex items-center justify-between p-4 rounded-3xl transition border group ${
                item.isCompleted 
                  ? "bg-gray-50/80 border-gray-100 opacity-60 line-through text-gray-400" 
                  : isCreator 
                    ? "bg-white border-gray-100 text-gray-700" // Your item: Clean Crisp White
                    : "bg-pink-100 border-pink-200 text-[#432C51]" // Partner item: Soft Tinted Hue
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Round Checkbox */}
                <button
                  type="button"
                  onClick={() => handleToggleItem(item._id)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition border ${
                    item.isCompleted
                      ? "bg-pink-500 border-pink-500 text-white text-xs"
                      : "border-gray-300 hover:border-pink-400 bg-white"
                  }`}
                >
                  {item.isCompleted && "✓"}
                </button>
                <span className="font-medium text-sm md:text-base">{item.title}</span>
              </div>
              
              {/* End Icon Tag Indicator */}
              <div className="flex items-center gap-2">
                {!item.isCompleted && (
                  <span className="text-xs font-mono px-2 py-0.5 bg-gray-100/70 text-gray-400 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    {isCreator ? "You" : "Partner"}
                  </span>
                )}
                <span className="text-sm opacity-80">{icon}</span>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-gray-300 text-sm">
            No items in this category yet. Start typing to write your bucket list story together! 🌟
          </div>
        )}
      </div>
    </div>
  );
}