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
import Mood from "./pages/Mood";
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
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/meals" element={<Meals />} />
          <Route path="/dates" element={<Dates />} />
          <Route path="/truth-dare" element={<TruthDare />} />
          <Route path="/memories" element={<Memories />} />
          <Route path="/bucket-list" element={<BucketList />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/mood" element={<Mood />} />
          <Route path="/to-do-list" element={<ToDoList />} />
          <Route path="/budget-tracker" element={<Budgettracker />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
