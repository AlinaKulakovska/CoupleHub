import { useState, useEffect } from "react";

export default function MealsAndGroceries() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [copiedStatus, setCopiedStatus] = useState(false);

  // Form Field States
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [ingredientsInput, setIngredientsInput] = useState("");
  const [image, setImage] = useState("");

  // API Base Endpoint Configuration
  const API_URL = "http://localhost:5000/api/meals";

  // Fetch data live from backend database on mount
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      console.error("Database communication failure:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  // Submit and save directly to MongoDB
  const handleAddRecipe = async (e) => {
    e.preventDefault();
    if (!title.trim() || !time || !ingredientsInput.trim()) return;

    const payload = {
      title,
      time: parseInt(time),
      tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
      ingredients: ingredientsInput.split("\n").map(i => i.trim()).filter(Boolean),
      image: image || undefined
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const savedRecipe = await response.json();
        // Update local layout array state dynamically
        setRecipes([savedRecipe, ...recipes]);
        
        // Reset local variables
        setTitle(""); setTime(""); setTagsInput(""); setIngredientsInput(""); setImage("");
        setIsFormOpen(false);
      }
    } catch (err) {
      console.error("Failed to commit recipe data record:", err);
    }
  };
const copyAndGoToBring = (recipe) => {
  const ingredientsText = recipe.ingredients.join("\n");
  navigator.clipboard.writeText(ingredientsText)
    .then(() => {
      setCopiedStatus(true);
      setTimeout(() => setCopiedStatus(false), 3000);
      window.open("https://web.getbring.com/app/lists/1");
    })
    .catch(err => console.error("Clipboard drop failure:", err));
};

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-[#FAF6F6] min-h-screen text-[#432C51]">
      
      {/* Header Info UI Blocks */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 text-2xl font-bold">
            <span className="p-2 bg-pink-100 rounded-xl text-pink-500 text-sm">🍽️</span>
            <h1>Meals & Groceries</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">Plan your week, build your list.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-4 py-2 bg-white text-xs font-bold border border-pink-200 text-pink-600 rounded-xl hover:bg-pink-50 transition cursor-pointer"
        >
          {isFormOpen ? "✕ Cancel" : "＋ Create Recipe"}
        </button>
      </div>

      <button 
        onClick={() => recipes.length > 0 && setSelectedRecipe(recipes[Math.floor(Math.random() * recipes.length)])}
        disabled={recipes.length === 0}
        className="w-full py-3.5 bg-[#B06A82] text-white font-medium rounded-2xl hover:bg-[#96556C] disabled:opacity-50 transition shadow-xs flex items-center justify-center gap-2 text-sm cursor-pointer"
      >
        <span>🔀</span> Surprise Me — What Should We Cook?
      </button>

      {/* Creation Form Layout Panel Section */}
      {isFormOpen && (
        <form onSubmit={handleAddRecipe} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4 animate-scaleUp">
          <h3 className="font-bold text-sm text-gray-700">Add New Shared Recipe</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Recipe Name</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs outline-hidden text-gray-700" required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Time (mins)</label>
                  <input type="number" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs outline-hidden text-gray-700" required />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Tags</label>
                  <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs outline-hidden text-gray-700" placeholder="Italian, Cozy" />
                </div>
              </div>
              <div>
                <input type="file" accept="image/*" onChange={handleImageFile} className="w-full text-[11px] text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-pink-50 file:text-pink-600 cursor-pointer" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Ingredients (One per line)</label>
              <textarea rows="6" value={ingredientsInput} onChange={(e) => setIngredientsInput(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs outline-hidden text-gray-700 font-mono resize-none h-35.5" required />
            </div>
          </div>
          <button type="submit" className="w-full py-2.5 bg-[#B06A82] text-white rounded-xl text-xs font-bold hover:bg-[#96556C] transition shadow-xs">Save to Database Board</button>
        </form>
      )}

      {/* Grid Container Content View Blocks */}
      {loading ? (
        <div className="text-center py-12 text-xs text-gray-400 font-medium animate-pulse tracking-widest uppercase">Connecting to Database...</div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-12 text-sm italic text-gray-400 border border-dashed border-gray-200 rounded-3xl bg-white">No entries inside your recipe database table yet. Click "Create Recipe" above to seed!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recipes.map((recipe) => (
            <div 
              key={recipe._id} 
              onClick={() => setSelectedRecipe(recipe)}
              className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden group cursor-pointer hover:border-pink-100 transition flex flex-col"
            >
              <div className="h-44 bg-gray-50 overflow-hidden">
                <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-102 transition duration-500" />
              </div>
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-gray-800 tracking-wide">{recipe.title}</h3>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {recipe.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-[#FAF6F6] text-gray-500 rounded-md text-[10px] font-bold">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium pt-1 border-t border-gray-50">
                  <span>⏱️ {recipe.time} min</span>
                  <span className="text-pink-500 font-bold">＋ View & Add</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Entry Overlay Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-pink-50 animate-scaleUp flex flex-col max-h-[90vh]">
            <div className="h-48 bg-gray-100 relative shrink-0">
              <img src={selectedRecipe.image} alt={selectedRecipe.title} className="w-full h-full object-cover" />
              <button onClick={() => setSelectedRecipe(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center font-bold text-sm backdrop-blur-xs hover:bg-black/60 transition cursor-pointer">✕</button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              <div>
                <h3 className="text-xl font-bold font-serif text-gray-800">{selectedRecipe.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{selectedRecipe.time} minutes prep time</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Ingredients</h4>
                <ul className="space-y-1.5">
                  {selectedRecipe.ingredients.map((ing, idx) => (
                    <li key={idx} className="text-xs font-medium text-gray-600 flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100/50">
                      <span className="text-pink-400">🔹</span> {ing}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 shrink-0 space-y-2">
              <button 
                onClick={() => copyAndGoToBring(selectedRecipe)}
                className={`w-full py-3 text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer text-white
                  ${copiedStatus ? "bg-emerald-500 hover:bg-emerald-600" : "bg-red-500 hover:bg-red-600"}`}
              >
                <span>{copiedStatus ? "✅ Copied to Clipboard!" : "🛒 Copy & Open Bring!"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}