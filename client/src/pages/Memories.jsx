import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const CATEGORY_ICONS = {
  Travel: "🏖️",
  Movie: "🎬",
  Anniversary: "🥂",
  General: "📸"
};

export default function Memories() {
  const { user } = useContext(AuthContext);
  const coupleId = user?.couple?._id || user?.couple;
  const loggedInUserId = user?.id || user?._id;

  const [memories, setMemories] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // New Memory Input States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("General");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (coupleId) {
      fetch(`http://localhost:5000/api/memories/${coupleId}`)
        .then((res) => res.json())
        .then((data) => setMemories(Array.isArray(data) ? data : []))
        .catch((err) => console.error(err));
    }
  }, [coupleId]);

  // Read local filesystem image and convert to Base64 data-string
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result); // Base64 encoding result
    };
    reader.readAsDataURL(file);
  };

  const handleSaveMemory = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !date) return;

    try {
      const response = await fetch("http://localhost:5000/api/memories/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coupleId,
          title,
          description,
          date,
          category,
          image,
          userId: loggedInUserId
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMemories([data, ...memories]);
        // Reset form variables
        setTitle("");
        setDescription("");
        setDate("");
        setCategory("General");
        setImage("");
        setIsFormOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 bg-[#FAF6F6] min-h-screen text-[#432C51]">
      {/* Title Header Block */}
      <div>
        <div className="flex items-center gap-2 text-2xl font-bold">
          <span className="p-2 bg-pink-100 rounded-xl text-pink-500 text-sm">📸</span>
          <h1>Memories</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Every moment worth keeping, together.</p>
      </div>

      {/* Expandable Form Trigger Button */}
      <button 
        onClick={() => setIsFormOpen(!isFormOpen)} 
        className="w-full py-3 bg-[#B06A82] text-white font-medium rounded-2xl hover:bg-[#96556C] transition shadow-xs flex items-center justify-center gap-2"
      >
        <span>{isFormOpen ? "✕ Close Form Container" : "＋ Add a Memory"}</span>
      </button>

      {/* Collapsible New Memory Entry Form */}
      {isFormOpen && (
        <form onSubmit={handleSaveMemory} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4 animate-fadeIn">
          <div>
            <label className="text-xs font-bold uppercase text-gray-400 block mb-1">Memory Title</label>
            <input 
              type="text" placeholder="e.g. Beach Weekend Getaway..." value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2.5 outline-hidden text-sm text-gray-700 placeholder-gray-300"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-400 block mb-1">What happened? (Story)</label>
            <textarea 
              rows="3" placeholder="Write down the details of this special moment..." value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2.5 outline-hidden text-sm text-gray-700 placeholder-gray-300 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase text-gray-400 block mb-1">When was this?</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-3 py-2 text-sm outline-hidden text-gray-700" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-400 block mb-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-3 py-2 text-sm outline-hidden text-gray-700 cursor-pointer">
                <option value="General">📸 General</option>
                <option value="Travel">🏖️ Travel</option>
                <option value="Movie">🎬 Movie Night</option>
                <option value="Anniversary">🥂 Anniversary</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-400 block mb-1">Upload Snapshot Picture</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 cursor-pointer" />
            {image && <img src={image} alt="Upload preview" className="mt-3 max-h-32 rounded-xl object-cover border border-gray-100" />}
          </div>

          <button className="w-full py-3 bg-[#B06A82] text-white rounded-2xl font-semibold text-sm hover:bg-[#96556C] transition shadow-xs">
            Save to Shared Timeline
          </button>
        </form>
      )}

      {/* TIMELINE DISPLAY ELEMENT STACK */}
      <div className="relative pl-8 md:pl-12 space-y-8 mt-4">
        {/* Continuous Left Vertical Connecting Rail Tracker */}
        <div className="absolute top-3 bottom-3 left-[19px] md:left-[27px] w-0.5 bg-pink-100" />

        {memories.map((mem) => (
          <div key={mem._id} className="relative group animate-fadeIn">
            
            {/* Absolute Placed Category Node Badge Circle Indicator */}
            <span className="absolute -left-[30px] md:-left-[38px] top-2 w-7 h-7 md:w-9 md:h-9 bg-[#FFF4F7] border border-pink-100 rounded-full flex items-center justify-center text-xs md:text-sm z-10 shadow-xs">
              {CATEGORY_ICONS[mem.category] || "📸"}
            </span>

            {/* Memory White Backing Card Frame Layout */}
            <div className="bg-white p-5 md:p-6 rounded-3xl border border-gray-100/80 shadow-xs hover:border-pink-100/60 transition-all space-y-3">
              <div className="space-y-0.5">
                <p className="text-[11px] font-medium text-gray-400">
                  {new Date(mem.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <h2 className="text-lg font-bold font-serif text-gray-800 tracking-wide leading-snug">{mem.title}</h2>
              </div>

              {/* Conditional Picture Box Render Block */}
              {mem.image && (
                <div className="overflow-hidden rounded-2xl border border-gray-50 max-h-64 flex items-center justify-center bg-gray-50">
                  <img src={mem.image} alt={mem.title} className="w-full h-full object-cover group-hover:scale-101 transition duration-500" />
                </div>
              )}

              {/* Narrative Story Description */}
              <p className="text-sm text-gray-500 leading-relaxed font-medium">{mem.description}</p>
            </div>

          </div>
        ))}

        {memories.length === 0 && (
          <div className="text-center py-16 text-gray-300 text-sm italic bg-white rounded-3xl border border-dashed border-gray-200">
            Your shared romantic timeline is empty. Tap "Add a Memory" to save your milestones. ✨
          </div>
        )}
      </div>
    </div>
  );
}