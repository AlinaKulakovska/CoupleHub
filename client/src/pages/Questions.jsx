import { useState, useEffect,useContext } from "react";
import { AuthContext } from "../context/AuthContext";
export default function DeepQuestions() {
  const [activeUser, setActiveUser] = useState("Alex");
  const [todayData, setTodayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
 const { user } = useContext(AuthContext);
  // Controlled input states
  const [inputText, setInputText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const coupleData = user?.couple;
  const user1Id = coupleData?.user1?._id || coupleData?.user1;
  const loggedInUserId = user?.id || user?._id;

  const isUser1 = String(loggedInUserId) === String(user1Id);
  const partnerObj = isUser1 ? coupleData?.user2 : coupleData?.user1;

  // Define backend base URL
  const API_URL = "https://couplehub-gzl5.onrender.com/api/questions"; // Replace with your production server URL when deployed

  // Fetch today's question and past history from MongoDB
  useEffect(() => {
    loadPageData();
  }, []);

  // Update textarea input field whenever switching between Alex and Sam
  useEffect(() => {
    if (todayData?.answers) {
      setInputText(todayData.answers[activeUser] || "");
    }
  }, [activeUser, todayData]);

  const loadPageData = async () => {
    setLoading(true);
    try {
      // 1. Get today's question & current answers
      const resToday = await fetch(`${API_URL}/today`);
      const dataToday = await resToday.json();
      setTodayData(dataToday);

      // 2. Get past questions history
      const resHistory = await fetch(`${API_URL}/history`);
      const dataHistory = await resHistory.json();
      setHistory(dataHistory);
    } catch (err) {
      console.error("Backend connection error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !todayData) return;

    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dateKey: todayData.dateKey,
          user: activeUser,
          answer: inputText
        })
      });

      if (response.ok) {
        const updatedRecord = await response.json();
        setTodayData(updatedRecord); // Update state with newly saved answer
      }
    } catch (err) {
      console.error("Failed to submit answer:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).toUpperCase();

  const currentAnswer = todayData?.answers?.[activeUser] || "";

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6 bg-[#FAF6F6] min-h-screen text-[#432C51] font-sans">
      
      {/* 1. Header Section */}
      <div>
        <div className="flex items-center gap-2 text-2xl font-serif font-bold text-gray-800">
          <span className="p-1.5 bg-pink-100 rounded-full text-pink-500 text-xs flex items-center justify-center w-7 h-7">
            💬
          </span>
          <h1>Deep Questions</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">One meaningful question, every single day.</p>
      </div>

      {/* 2. Today's Question Card */}
      <div className="bg-[#FAF5F8] border border-pink-100/60 rounded-3xl p-6 md:p-8 shadow-xs space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 tracking-wider">
          <span>✨</span>
          <span>{formattedDate}</span>
        </div>

        {loading ? (
          <div className="h-12 flex items-center text-gray-400 text-sm italic animate-pulse">
            Connecting to database...
          </div>
        ) : (
          <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-800 leading-snug">
            {todayData?.question || '"What does love look like to you on an ordinary Tuesday?"'}
          </h2>
        )}
      </div>

      {/* 3. User Switcher Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-gray-100 flex items-center shadow-xs">
        <button
          onClick={() => setActiveUser("Alex")}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
            activeUser === "Alex" 
              ? "bg-[#B06A82] text-white shadow-xs" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <span>🧑‍🎨</span>  {user?.name || "User"} 
        </button>

        <button
          onClick={() => setActiveUser("Sam")}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
            activeUser === "Sam" 
              ? "bg-[#B06A82] text-white shadow-xs" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <span>🧑‍🚀</span> {partnerObj?.name || "Waiting..."} 
        </button>
      </div>

      {/* 4. Answer Input Box */}
      <div className="bg-white rounded-3xl border border-gray-100/70 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-semibold text-gray-500">
          Your Answer
        </h3>

        {currentAnswer && !submitting ? (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-emerald-700 text-sm space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold">✓ Saved to Database</span>
              <button 
                onClick={() => setTodayData({
                  ...todayData,
                  answers: { ...todayData.answers, [activeUser]: "" }
                })}
                className="text-xs underline text-emerald-600 hover:text-emerald-800 cursor-pointer"
              >
                Edit
              </button>
            </div>
            <p className="text-xs text-emerald-600 font-normal">"{currentAnswer}"</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              rows="5"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Write your honest answer here..."
              className="w-full text-sm text-gray-700 placeholder-gray-300 outline-none resize-none bg-transparent"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || submitting}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-xs cursor-pointer ${
                inputText.trim() && !submitting
                  ? "bg-[#B06A82] text-white hover:bg-[#96556C]"
                  : "bg-pink-100/70 text-pink-300 cursor-not-allowed"
              }`}
            >
              <span>🔒</span> {submitting ? "Saving..." : "Submit Answer"}
            </button>
          </form>
        )}
      </div>

      {/* 5. Previous Questions List */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Previous Questions
        </h3>

        {history.length === 0 ? (
          <div className="bg-white rounded-2xl p-4 border border-gray-100/70 text-xs text-gray-400 italic text-center">
            No previous questions recorded yet. Check back tomorrow!
          </div>
        ) : (
          <div className="space-y-2.5">
            {history.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl p-4 border border-gray-100/70 shadow-xs space-y-1 hover:border-pink-100 transition"
              >
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="text-gray-400">📖</span>
                  <p className="font-medium text-gray-700">{item.question}</p>
                </div>
                {(item.answers?.Alex || item.answers?.Sam) && (
                  <div className="text-[11px] text-gray-400 pl-6 space-y-0.5">
                    {item.answers?.Alex && <p>Alex: "{item.answers.Alex}"</p>}
                    {item.answers?.Sam && <p>Sam: "{item.answers.Sam}"</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}