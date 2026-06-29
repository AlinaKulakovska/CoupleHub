import { useContext } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import { AuthContext } from "./context/AuthContext";

import Home from "./pages/Home";
import Meals from "./pages/Meals";
import Dates from "./pages/Dates";
import TruthDare from "./pages/Dare";
import Questions from "./pages/Questions";
import Memories from "./pages/Memories";
import BucketList from "./pages/BucketList";
import Challenges from "./pages/Challenges";
import MoodTracker from "./pages/MoodTracker";
import ToDoList from "./pages/ToDoList";
import Budgettracker from "./pages/Budgettracker";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const hideSidebarRoutes = ["/login", "/register"];
  const hideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex w-full">
      {user && !hideSidebar && <Sidebar />}

      <div className="flex-1 p-8">
        <Routes>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>}/>
          <Route path="/meals" element={<ProtectedRoute><Meals /></ProtectedRoute>} />
          <Route path="/dates" element={<ProtectedRoute><Dates /></ProtectedRoute>} />
          <Route path="/truth-dare" element={<ProtectedRoute><TruthDare /></ProtectedRoute>} />
          <Route path="/questions" element={<ProtectedRoute><Questions /></ProtectedRoute>} />
          <Route path="/memories" element={<ProtectedRoute><Memories /></ProtectedRoute>} />
          <Route path="/bucket-list" element={<ProtectedRoute><BucketList /></ProtectedRoute>} />
          <Route path="/challenges" element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
          <Route path="/mood-tracker" element={<ProtectedRoute><MoodTracker /></ProtectedRoute>} />
          <Route path="/to-do-list" element={<ProtectedRoute><ToDoList /></ProtectedRoute>} />
          <Route path="/budget-tracker" element={<ProtectedRoute><Budgettracker /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
