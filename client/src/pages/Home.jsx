import Header from "../components/Header";
import FeatureCard from "../components/FeatureCard";
import TimeElapsedWidget from "../components/TimeElapsedWidget";

import { NavLink, Route } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { user, logout, setUser } = useContext(AuthContext);
  const [partnerMood, setPartnerMood] = useState(null);
  const [todayQuestion, setTodayQuestion] = useState("");
  const [loadingQuestion, setLoadingQuestion] = useState(true);

  // 1. Point directly to user.couple
  const coupleData = user?.couple;

  // 2. Extract the IDs whether they are deeply populated objects OR raw string IDs
  const user1Id = coupleData?.user1?._id || coupleData?.user1;
  const user2Id = coupleData?.user2?._id || coupleData?.user2;
  const loggedInUserId = user?.id || user?._id;
  const coupleId = user?.couple?._id || user?.couple;

  // 3. Determine who the partner is
  const isUser1 = loggedInUserId === user1Id;
  const partnerObj = isUser1 ? coupleData?.user2 : coupleData?.user1;

  // 👉 FETCH TODAY'S QUESTION FROM BACKEND
  useEffect(() => {
    fetch("http://localhost:5000/api/questions/today")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.question) {
          setTodayQuestion(data.question);
        }
      })
      .catch((err) => console.error("Error loading question of the day:", err))
      .finally(() => setLoadingQuestion(false));
  }, []);

  // 👉 FETCH STATUS UPON DASHBOARD UNLOCK
  useEffect(() => {
    if (coupleId) {
      fetch(`http://localhost:5000/api/moods/${coupleId}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const theirs = data.find((m) => String(m.user) !== String(loggedInUserId));
            if (theirs) setPartnerMood(theirs);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [coupleId, loggedInUserId]);

  // 4. Verification flag: Does user2 exist in the couple document?
  const isConnectedWithPartner = !!user2Id;

  // 👉 AUTOMATIC POLLING COUPLING CHECK
  useEffect(() => {
    if (isConnectedWithPartner || !user?.token) return;

    const checkPartnerStatus = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/check-status",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({ userId: loggedInUserId }),
          },
        );

        const data = await response.json();

        if (response.ok && data.couple?.user2) {
          const updatedUser = { ...user, couple: data.couple };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
      } catch (err) {
        console.error("Error polling connection status", err);
      }
    };

    const interval = setInterval(checkPartnerStatus, 5000);
    return () => clearInterval(interval);
  }, [isConnectedWithPartner, user, loggedInUserId, setUser]);

  return (
    <div className="flex w-full min-h-screen">
      {/* ❌ NOT CONNECTED YET */}
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
              Your account is lonely! Share your unique **Hub ID** with your
              partner so they can link accounts with you during registration:
            </p>

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
              Waiting for your partner to join... Refresh the page once they
              register!
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
        /* CONNECTED DASHBOARD */
        <div className="flex-1 p-8 space-y-6">
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
              <h2 className="text-2xl font-bold text-pink-500">
                Connected! 💍
              </h2>
              <p className="text-gray-500 text-sm">Your hub is linked up.</p>
            </div>
          </div>

          {/* Dynamic Daily Question Widget */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-pink-500 text-sm uppercase font-bold tracking-wider">
              Today's Deep Question
            </p>
            
            {loadingQuestion ? (
              <p className="text-gray-400 text-sm mt-2 italic animate-pulse">
                Loading today's question...
              </p>
            ) : (
              <p className="text-lg font-medium mt-2 text-gray-800">
                {todayQuestion || "What does love look like to you on an ordinary Tuesday?"}
              </p>
            )}

            <p className="text-pink-500 mt-3 text-sm font-semibold hover:underline">
              <NavLink to="/questions">Answer together →</NavLink>
            </p>
          </div>

          {/* Partner Status */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between border border-gray-100/50">
            <div>
              <p className="text-pink-500 text-xs font-bold uppercase tracking-wider">Partner Status</p>
              <h3 className="text-gray-700 font-medium text-base mt-1">How's your favorite person doing?</h3>
            </div>
            {partnerMood ? (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border font-semibold ${partnerMood.color}`}>
                <span>{partnerMood.emoji}</span>
                <span>{partnerMood.label}</span>
              </div>
            ) : (
              <span className="text-gray-400 text-sm italic">Not checked in</span>
            )}
          </div>

          <button
            onClick={logout}
            className="bg-gray-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-gray-600 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>); 
}