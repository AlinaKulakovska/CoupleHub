import Header from "../components/Header";
import FeatureCard from "../components/FeatureCard";
import TimeElapsedWidget from "../components/TimeElapsedWidget";

import { NavLink, Route } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
const { user, logout, setUser} = useContext(AuthContext);
  
  // 1. Point directly to user.couple (matching our Step 1 update)
  const coupleData = user?.couple;

  // 2. Extract the IDs whether they are deeply populated objects OR raw string IDs
  const user1Id = coupleData?.user1?._id || coupleData?.user1;
  const user2Id = coupleData?.user2?._id || coupleData?.user2;
  const loggedInUserId = user?.id || user?._id;

  // 3. Determine who the partner is
  // If the logged-in user is user1, then the partner is user2 (and vice versa)
  const isUser1 = loggedInUserId === user1Id;
  const partnerObj = isUser1 ? coupleData?.user2 : coupleData?.user1;

  // 4. Verification flag: Does user2 exist in the couple document?
  const isConnectedWithPartner = !!user2Id;
// 👉 AUTOMATIC POLLING COUPLING CHECK
  useEffect(() => {
    // If we are already connected, don't check anymore!
    if (isConnectedWithPartner || !user?.token) return;

    const checkPartnerStatus = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/check-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`
          },
          body: JSON.stringify({ userId: loggedInUserId })
        });
        
        const data = await response.json();
        
        // If the backend says user2 has arrived!
        if (response.ok && data.couple?.user2) {
          const updatedUser = { ...user, couple: data.couple };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser); // This triggers an immediate reactive re-render!
        }
      } catch (err) {
        console.error("Error polling connection status", err);
      }
    };

    // Check every 5 seconds
    const interval = setInterval(checkPartnerStatus, 5000);
    return () => clearInterval(interval); // Clean up on unmount
  }, [isConnectedWithPartner, user, loggedInUserId, setUser]);
  return (
    <div className="flex w-full min-h-screen">
      
      {/* ❌ NOT CONNECTED YET: Show the onboarding block with the Copy ID box */}
      {!isConnectedWithPartner ? (
        <div className="p-6 bg-pink-50 rounded-3xl max-w-xl mx-auto mt-10 shadow-md h-fit">
          <h1 className="text-3xl font-bold text-pink-600 mb-4">
            Welcome, {user?.name || "User"}! ❤️
          </h1>

          <div className="bg-white p-4 rounded-2xl border border-pink-200 space-y-2 shadow-sm">
            <p className="text-gray-700 font-medium">
              Connect with your partner:
            </p>
            <p className="text-sm text-gray-500">
              Your account is lonely! Share your unique **Hub ID** with your partner so they can link accounts with you during registration:
            </p>

            {/* Displays the unique MongoDB _id */}
            <div className="flex items-center justify-between bg-gray-100 p-3 rounded-xl border font-mono text-sm select-all">
              <span>{user?.id || user?._id}</span>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(user?.id || user?._id)
                }
                className="text-xs bg-pink-500 text-white px-2 py-1 rounded-lg font-sans hover:bg-pink-600"
              >
                Copy
              </button>
            </div>
            <p className="text-xs text-gray-400 italic mt-2 animate-pulse">
              Waiting for your partner to join... Refresh the page once they register!
            </p>
          </div>

          <button
            onClick={logout}
            className="mt-6 bg-gray-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-gray-600 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        
        /* CONNECTED: Hide onboarding and reveal your full interactive dashboard */
        <div className="flex-1 p-8 space-y-6">
          {/* Header */}
          <Header />
          {/* Stats */}
          <div className="flex gap-4">
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center flex-1">
              <p className="text-gray-500 text-sm">We are Together for:</p>
              <h2 className="text-2xl font-bold text-pink-500">
                <TimeElapsedWidget /> :){" "}
              </h2>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center flex-1">
              <h2 className="text-2xl font-bold text-pink-500">Connected! 💍</h2>
              <p className="text-gray-500 text-sm">Your hub is linked up.</p>
            </div>
          </div>

          {/* Daily Question */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-pink-500 text-sm uppercase">
              Today's Deep Question
            </p>
            <p className="text-lg font-medium mt-2">
              If you could give your younger self one piece of advice, what
              would it be?
            </p>
            <p className="text-pink-500 mt-2 text-sm cursor-pointer">
              <NavLink to="/questions">Answer together →</NavLink>
            </p>
          </div>
          <p className="text-gray-600 italic">partners mood???</p>
          
          <button
            onClick={logout}
            className="bg-gray-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-gray-600 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}