import {
  Home,
  Utensils,
  Heart,
  MessageCircle,
  Image,
  ListTodo,
  Trophy,
  Smile,
  DollarSign,
  List,
  Dice5,
  Camera,
} from "lucide-react";
import { NavLink } from "react-router-dom";



export default function Sidebar() {

function NavItem({ icon, label, to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 p-3 rounded-xl transition
        ${
          isActive
            ? "bg-pink-100 text-pink-600"
            : "text-gray-600 hover:bg-pink-50"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}

  return (
    <div className="w-64 bg-white border-r-2 border-pink-300 flex flex-col p-5">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center">
          ❤️
        </div>
        <div>
          <h1 className="font-bold text-lg">CoupleHub</h1>
          <p className="text-xs text-gray-500">Janik & Alina ✨</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2 text-gray-600">
        <NavItem icon={<Home size={18} />} label="Home" to="/" />

        <NavItem icon={<Utensils size={18} />} label="Meals" to="/meals" />

        <NavItem icon={<Heart size={18} />} label="Dates" to="/dates" />

        <NavItem
          icon={<Dice5 size={18} />}
          label="Truth/Dare"
          to="/truth-dare"
        />


        <NavItem icon={<Camera size={18} />} label="Memories" to="/memories" />

        <NavItem
          icon={<ListTodo size={18} />}
          label="Bucket List"
          to="/bucket-list"
        />

        <NavItem
          icon={<Trophy size={18} />}
          label="Challenges"
          to="/challenges"
        />

        <NavItem icon={<Smile size={18} />} label="Mood" to="/mood" />
        <NavItem icon={<List size={18} />} label="To-Do List" to="/to-do-list" />
        <NavItem icon={<DollarSign size={18} />} label="Budget Tracker" to="/budget-tracker" />
      </nav>
      <div className=" text-xs text-center text-gray-400 border-t-2 pt-4 mt-2 border-pink-300">
       Private for two 💕
      </div>
    </div>
  );
}

function NavItem({ icon, label, active }) {
  return (
    <div
      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
        active ? "bg-pink-100 text-pink-600" : "hover:bg-gray-100"
      }`}
    >
      {icon}
      {label}
    </div>
  );
}
