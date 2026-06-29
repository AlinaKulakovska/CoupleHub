import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ToDoList() {
  const { user } = useContext(AuthContext);
  const coupleId = user?.couple?._id || user?.couple;
  const loggedInUserId = user?.id || user?._id;

  // Identify partner configuration structures
  const user1Id = user?.couple?.user1?._id || user?.couple?.user1;
  const user1Name = user?.couple?.user1?.name || "Partner 1";
  const user2Name = user?.couple?.user2?.name || "Partner 2";
  const isUser1 = String(loggedInUserId) === String(user1Id);

  // Core functional state management variables
  const [tasks, setTasks] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  // Form Field Entries
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("Together");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (coupleId) {
      fetch(`http://localhost:5000/api/tasks/${coupleId}`)
        .then((res) => res.json())
        .then((data) => setTasks(Array.isArray(data) ? data : []))
        .catch((err) => console.error(err));
    }
  }, [coupleId]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    try {
      const response = await fetch("http://localhost:5000/api/tasks/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coupleId,
          title,
          assignedTo,
          priority,
          dueDate,
          userId: loggedInUserId,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setTasks([...tasks, data]);
        setTitle("");
        setDueDate("");
        setIsFormOpen(false); // Auto-hide form on completion
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTask = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/toggle/${id}`, {
        method: "PATCH",
      });
      if (response.ok) {
        setTasks(tasks.map(t => t._id === id ? { ...t, isCompleted: !t.isCompleted } : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Metric Calculation Logic matching the UI dashboard cards
  const remainingCount = tasks.filter((t) => !t.isCompleted).length;
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filter Tasks by Selection Chips Row
  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Done") return t.isCompleted;
    if (activeFilter === "Together") return t.assignedTo === "Together" && !t.isCompleted;
    if (activeFilter === "User1") return t.assignedTo === "User1" && !t.isCompleted;
    if (activeFilter === "User2") return t.assignedTo === "User2" && !t.isCompleted;
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6 min-h-screen text-[#432C51]">
      {/* Heading Block */}
      <div>
        <div className="flex items-center gap-2 text-2xl font-bold">
          <span className="p-2 bg-pink-100 rounded-xl text-pink-500 text-sm">📋</span>
          <h1>To-Do List</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Stay on top of everything, together.</p>
      </div>

      {/* Analytics Card Header Grid */}
      <div className="bg-white p-6 rounded-3xl shadow-xs border border-pink-50 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs text-gray-400 font-semibold uppercase">Remaining tasks</p>
          <p className="text-4xl font-serif font-bold text-gray-800">{remainingCount}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-400 font-semibold uppercase">Completed</p>
          <p className="text-4xl font-serif font-bold text-emerald-600">{completedCount}</p>
        </div>
        {/* Progress Circle Visual Ring layout */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="32" cy="32" r="28" stroke="#FCE7F3" strokeWidth="5" fill="transparent" />
            <circle 
              cx="32" cy="32" r="28" stroke="#B45309" strokeWidth="5" fill="transparent"
              strokeDasharray={176} strokeDashoffset={176 - (176 * progressPercent) / 100}
              className="transition-all duration-500"
            />
          </svg>
          <span className="absolute text-xs font-bold text-amber-800">{progressPercent}%</span>
        </div>
      </div>

      {/* Expandable Field Form trigger button */}
      <button 
        onClick={() => setIsFormOpen(!isFormOpen)}
        className="w-full py-3 bg-[#B06A82] text-white font-medium rounded-2xl hover:bg-[#96556C] transition shadow-xs flex items-center justify-center gap-2"
      >
        <span>{isFormOpen ? "✕ Close Form" : "＋ Add Task"}</span>
      </button>

      {/* Hidden Collapsible Form Block */}
      {isFormOpen && (
        <form onSubmit={handleAddTask} className="bg-white p-6 rounded-3xl border border-gray-100 space-y-4 shadow-xs animate-fadeIn">
          <div>
            <label className="text-xs font-bold uppercase text-gray-400 block mb-1">Task Name</label>
            <input 
              type="text" placeholder="e.g. Plan weekend hiking trip..." value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 outline-hidden text-gray-700"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold uppercase text-gray-400 block mb-1">Assign To</label>
              <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm outline-hidden">
                <option value="Together">🤝 Together</option>
                <option value="User1">👤 {user1Name}</option>
                <option value="User2">👤 {user2Name}</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-400 block mb-1">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm outline-hidden">
                <option value="High">🔴 High</option>
                <option value="Medium">🟡 Medium</option>
                <option value="Low">🟢 Low</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-400 block mb-1">Deadline Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm outline-hidden" />
            </div>
          </div>
          <button className="w-full py-2.5 bg-emerald-700 text-white rounded-xl font-semibold text-sm hover:bg-emerald-800 transition">Save Task Entry</button>
        </form>
      )}

      {/* Selection Filter Filter Chips Row */}
      <div className="flex gap-2 items-center overflow-x-auto pb-1">
        {[
          { id: "All", label: "All" },
          { id: "Together", label: "🤝 Together" },
          { id: "User1", label: `🧑 ${user1Name}` },
          { id: "User2", label: `👧 ${user2Name}` },
          { id: "Done", label: "✅ Done" }
        ].map((chip) => (
          <button
            key={chip.id} onClick={() => setActiveFilter(chip.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap ${
              activeFilter === chip.id ? "bg-[#B06A82] text-white shadow-xs" : "bg-pink-50/60 text-[#432C51] hover:bg-pink-100"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Task Rows Display Cards Stack */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const isOverdue = new Date(task.dueDate) < new Date() && !task.isCompleted;
          const assignedLabel = task.assignedTo === "Together" ? "Together" : task.assignedTo === "User1" ? user1Name : user2Name;
          
          // Color coding for dynamic priority flags matching the UI blueprint
          const priorityColor = task.priority === "High" ? "bg-red-50 text-red-500 border-red-100" : task.priority === "Medium" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-blue-50 text-blue-500 border-blue-100";

          return (
            <div 
              key={task._id}
              className={`flex items-start justify-between p-5 bg-white rounded-3xl border border-gray-100/70 transition-all ${
                task.isCompleted ? "opacity-50 bg-gray-50/50 line-through text-gray-400" : ""
              }`}
            >
              <div className="flex items-start gap-4 flex-1">
                <button
                  type="button" onClick={() => handleToggleTask(task._id)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition border mt-0.5 shrink-0 ${
                    task.isCompleted ? "bg-[#B06A82] border-[#B06A82] text-white text-xs" : "border-gray-300 bg-white"
                  }`}
                >
                  {task.isCompleted && "✓"}
                </button>
                
                <div className="space-y-2">
                  <p className="font-medium text-gray-700 text-base leading-snug">{task.title}</p>
                  
                  {/* Dynamic Metadata Badges layout matching row elements */}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-pink-100 text-pink-700">{assignedLabel}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${priorityColor}`}>🏁 {task.priority}</span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 ${isOverdue ? "text-red-500 font-semibold" : "text-gray-400"}`}>
                      ⏱️ {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      {isOverdue && " · Overdue!"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="text-center py-12 text-gray-300 text-sm italic">
            All caught up! Tap "Add Task" to record shared scheduling goals. 🎉
          </div>
        )}
      </div>
    </div>
  );
}