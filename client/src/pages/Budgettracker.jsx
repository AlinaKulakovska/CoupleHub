import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const CATEGORIES = [
  { name: "Food", icon: "🍽️", color: "bg-amber-500", hex: "#f59e0b", limit: 500 },
  { name: "Entertainment", icon: "🎭", color: "bg-indigo-500", hex: "#6366f1", limit: 200 },
  { name: "Transport", icon: "🚗", color: "bg-blue-500", hex: "#3b82f6", limit: 150 },
  { name: "Shopping", icon: "🛍️", color: "bg-pink-400", hex: "#f472b6", limit: 300 },
  { name: "Utilities", icon: "💡", color: "bg-emerald-500", hex: "#10b981", limit: 200 },
  { name: "Health", icon: "💊", color: "bg-red-500", hex: "#ef4444", limit: 100 }
];

// Single user individual budget limit placeholder allocation
const INDIVIDUAL_TOTAL_BUDGET = 1450;

export default function BudgetTracker() {
  const { user } = useContext(AuthContext);
  const coupleId = user?.couple?._id || user?.couple;

  // Extract User Profile details matching context structures
  const u1Id = user?.couple?.user1?._id || user?.couple?.user1;
  const u1Name = user?.couple?.user1?.name || "Partner 1";
  const u2Name = user?.couple?.user2?.name || "Partner 2";

  const [expenses, setExpenses] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  // Form Fields State
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [paidBy, setPaidBy] = useState(user?.id || user?._id || "User1");

  useEffect(() => {
    if (coupleId) {
      fetch(`http://localhost:5000/api/expenses/${coupleId}`)
        .then((res) => res.json())
        .then((data) => setExpenses(Array.isArray(data) ? data : []))
        .catch((err) => console.error(err));
    }
  }, [coupleId]);

  const handleSaveExpense = async (e) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    try {
      const response = await fetch("http://localhost:5000/api/expenses/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coupleId,
          title,
          amount,
          category,
          paidById: paidBy
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setExpenses([data, ...expenses]);
        setTitle("");
        setAmount("");
        setIsFormOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Compute User Financial Split Breakdowns
  const u1Spent = expenses.filter(e => String(e.paidBy) === String(u1Id)).reduce((sum, e) => sum + e.amount, 0);
  const u2Spent = expenses.filter(e => String(e.paidBy) !== String(u1Id)).reduce((sum, e) => sum + e.amount, 0);

  const combinedTotalSpent = u1Spent + u2Spent;
  const combinedTotalBudget = INDIVIDUAL_TOTAL_BUDGET * 2;
  const remainingTotalBudget = combinedTotalBudget - combinedTotalSpent;

  // Split calculations (Equitable half-split balance checking)
  const halfShare = combinedTotalSpent / 2;
  const balanceDifference = u1Spent - halfShare;

  // Compute Circular Progression Metrics
  const u1Percent = Math.min(Math.round((u1Spent / INDIVIDUAL_TOTAL_BUDGET) * 100), 100);
  const u2Percent = Math.min(Math.round((u2Spent / INDIVIDUAL_TOTAL_BUDGET) * 100), 100);

  const filteredExpenses = expenses.filter(e => activeFilter === "All" || e.category === activeFilter);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-[#FAF6F6] min-h-screen text-[#432C51]">
      {/* Heading Title row */}
      <div>
        <div className="flex items-center gap-2 text-2xl font-bold">
          <span className="p-2 bg-pink-100 rounded-xl text-pink-500 text-sm">👛</span>
          <h1>Budget Tracker</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Keep your finances beautifully in sync.</p>
      </div>

      {/* Top Level Metric Summary Cards Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-pink-50 text-center shadow-xs">
          <p className="text-2xl font-bold text-gray-800">${combinedTotalBudget}</p>
          <p className="text-xs text-gray-400 font-medium mt-1">Total Budget</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-pink-50 text-center shadow-xs">
          <p className="text-2xl font-bold text-pink-500">${combinedTotalSpent.toFixed(2)}</p>
          <p className="text-xs text-gray-400 font-medium mt-1">Spent</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-pink-50 text-center shadow-xs">
          <p className="text-2xl font-bold text-emerald-500">${remainingTotalBudget.toFixed(2)}</p>
          <p className="text-xs text-gray-400 font-medium mt-1">Remaining</p>
        </div>
      </div>


      {/* Main Container Layer for Category list breakdown and Double Chart Configuration Layout */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-gray-800 tracking-wide">Spending Profile Summaries</h3>
        
        {/* SIDE-BY-SIDE DOUBLE CHART ARCS CONTAINER ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2 pb-4 border-b border-gray-100">
          {/* User 1 Individual Allocation Ring */}
          <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="34" stroke="#FCE7F3" strokeWidth="6" fill="transparent" />
                <circle cx="40" cy="40" r="34" stroke="#B06A82" strokeWidth="6" fill="transparent"
                  strokeDasharray={213} strokeDashoffset={213 - (213 * u1Percent) / 100} className="transition-all duration-500" />
              </svg>
              <span className="absolute text-xs font-bold text-gray-700">{u1Percent}%</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{u1Name}'s Account</p>
              <p className="text-xs text-gray-400 mt-0.5">Individual limit allocated at ${INDIVIDUAL_TOTAL_BUDGET}</p>
              <p className="text-sm font-semibold text-pink-600 mt-1">${u1Spent.toFixed(2)} total spent</p>
            </div>
          </div>

          {/* User 2 Individual Allocation Ring */}
          <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="34" stroke="#E0E7FF" strokeWidth="6" fill="transparent" />
                <circle cx="40" cy="40" r="34" stroke="#4F46E5" strokeWidth="6" fill="transparent"
                  strokeDasharray={213} strokeDashoffset={213 - (213 * u2Percent) / 100} className="transition-all duration-500" />
              </svg>
              <span className="absolute text-xs font-bold text-gray-700">{u2Percent}%</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{u2Name}'s Account</p>
              <p className="text-xs text-gray-400 mt-0.5">Individual limit allocated at ${INDIVIDUAL_TOTAL_BUDGET}</p>
              <p className="text-sm font-semibold text-indigo-600 mt-1">${u2Spent.toFixed(2)} total spent</p>
            </div>
          </div>
        </div>

        {/* Categories Bar Distribution List stack */}
        <div className="space-y-4">
          {CATEGORIES.map((cat) => {
            const currentCatSpent = expenses.filter(e => e.category === cat.name).reduce((sum, e) => sum + e.amount, 0);
            const barWidthPercent = Math.min((currentCatSpent / cat.limit) * 100, 100);

            return (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-medium text-gray-600">
                  <span className="flex items-center gap-2">⏱️ {cat.icon} {cat.name}</span>
                  <span>${currentCatSpent.toFixed(2)} / ${cat.limit}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div style={{ width: `${barWidthPercent}%`, backgroundColor: cat.hex }} className="h-full transition-all duration-300" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Expense Toggle Trigger Action Block Button */}
      <button onClick={() => setIsFormOpen(!isFormOpen)} className="w-full py-3.5 bg-[#B06A82] text-white font-medium rounded-2xl hover:bg-[#96556C] transition shadow-xs flex items-center justify-center gap-2">
        <span>{isFormOpen ? "✕ Close Form Container" : "＋ Add Expense"}</span>
      </button>

      {/* Collapsible overlay dynamic field matching screenshot blueprints layout */}
      {isFormOpen && (
        <form onSubmit={handleSaveExpense} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4 animate-fadeIn">
          <input type="text" placeholder="What was this for?" value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100/70 rounded-2xl px-4 py-3 outline-hidden text-gray-700 placeholder-gray-300 text-sm" />
          
          <div className="flex gap-3">
            <input type="number" step="0.01" placeholder="$0.00" value={amount} onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-gray-50 border border-gray-100/70 rounded-2xl px-4 py-2.5 outline-hidden text-gray-700 placeholder-gray-300 text-sm" />
           
          </div>

          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-gray-50 border border-gray-100/70 rounded-2xl px-4 py-3 outline-hidden text-sm cursor-pointer text-gray-700">
            {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
          </select>

          <button className="w-full py-3 bg-[#B06A82] text-white rounded-2xl font-semibold text-sm hover:bg-[#96556C] transition shadow-xs">Save Expense Log</button>
        </form>
      )}

      {/* Horizontal Selection Categories Filtering Chips Bar Row */}
      <div className="flex gap-2 items-center overflow-x-auto pb-1">
        <button onClick={() => setActiveFilter("All")} className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${activeFilter === "All" ? "bg-[#B06A82] text-white shadow-xs" : "bg-white text-gray-600 hover:bg-gray-100"}`}>All</button>
        {CATEGORIES.map((cat) => (
          <button key={cat.name} onClick={() => setActiveFilter(cat.name)} className={`px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 transition ${activeFilter === cat.name ? "bg-[#B06A82] text-white shadow-xs" : "bg-purple-50/60 text-[#432C51] hover:bg-purple-100"}`}>
            <span>{cat.icon}</span><span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Main Dynamic Stack Array Feed for Expense Row Itemizations */}
      <div className="space-y-3">
        {filteredExpenses.map((exp) => {
          const currentCategoryDetails = CATEGORIES.find(c => c.name === exp.category);
          const payerName = String(exp.paidBy) === String(u1Id) ? u1Name : u2Name;

          return (
            <div key={exp._id} className="flex items-center justify-between p-4 bg-white rounded-3xl border border-gray-100/70 shadow-xs hover:border-pink-100 transition-all group">
              <div className="flex items-center gap-4">
                <span className="p-3 bg-gray-50 rounded-2xl text-lg shrink-0">{currentCategoryDetails?.icon || "💵"}</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm md:text-base leading-snug">{exp.title}</p>
                  <p className="text-[11px] text-gray-400 font-medium mt-1">
                    {new Date(exp.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })} · Paid by {payerName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-serif font-bold text-gray-800 text-base">${exp.amount.toFixed(2)}</span>
                <span style={{ backgroundColor: currentCategoryDetails?.hex }} className="w-2.5 h-2.5 rounded-full block shrink-0" />
              </div>
            </div>
          );
        })}

        {filteredExpenses.length === 0 && (
          <div className="text-center py-12 text-gray-300 text-sm italic">
            No expenses recorded here yet! Tap "Add Expense" to start saving together. 🌟
          </div>
        )}
      </div>
    </div>
  );
}