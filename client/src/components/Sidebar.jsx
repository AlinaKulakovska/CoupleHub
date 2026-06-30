import {
  Home,
  Utensils,
  Heart,
  Image,
  ListTodo,
  Trophy,
  Smile,
  DollarSign,
  List,
  Dice5,
  Camera,
  Menu, // Added Menu icon for burger button
  X,    // Added X icon to close sidebar
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false); // State to handle mobile toggle sidebar drawer open/close
  
  const coupleData = user?.couple;
  const user1Id = coupleData?.user1?._id || coupleData?.user1;
  const loggedInUserId = user?.id || user?._id;

  const isUser1 = String(loggedInUserId) === String(user1Id);
  const partnerObj = isUser1 ? coupleData?.user2 : coupleData?.user1;

  function NavItem({ icon, label, to }) {
    return (
      <NavLink
        to={to}
        onClick={() => setIsOpen(false)} // Close sidebar drawer when navigating to a link on mobile screens
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
    <>
      {/* Mobile Top Header Navbar: Displays only on small screens (hidden on desktop) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b-2 border-pink-200 px-4 flex items-center justify-between z-40">
        <div className="flex items-center gap-2">
          <span className="text-xl">❤️</span>
          <span className="font-bold text-gray-800">CoupleHub</span>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 text-gray-600 hover:bg-pink-50 rounded-xl transition cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Dimmed Dark Backdrop Panel overlay layer: visible only when mobile menu drawer is triggered open */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Responsive Sidebar Layer */}
      <div className={`
        fixed inset-y-0 left-0 w-64 bg-white border-r-2 border-pink-300 flex flex-col p-5 z-50 
        transform transition-transform duration-300 ease-in-out
        md:relative md:transform-none
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* Mobile Header Box Layer Wrapper Container (contains Title Logo and mobile 'X' close toggle button) */}
        <div className="flex items-center justify-between gap-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center shrink-0">
              ❤️
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">CoupleHub</h1>
              <p className="text-xs text-gray-500 line-clamp-1">
                {user?.name || "User"} & {partnerObj?.name || "Waiting..."} ✨
              </p>
            </div>
          </div>
          
          {/* Mobile 'X' Close button wrapper - Displays only on narrow viewport layouts */}
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu Grid stack array links */}
        <nav className="flex flex-col gap-1.5 text-gray-600 flex-1 overflow-y-auto pr-1">
          <NavItem icon={<Home size={18} />} label="Home" to="/" />
          <NavItem icon={<Utensils size={18} />} label="Meals" to="/meals" />
          <NavItem icon={<Heart size={18} />} label="Dates" to="/dates" />
          <NavItem icon={<Dice5 size={18} />} label="Truth/Dare" to="/truth-dare" />
          <NavItem icon={<Camera size={18} />} label="Memories" to="/memories" />
          <NavItem icon={<ListTodo size={18} />} label="Bucket List" to="/bucket-list" />
          <NavItem icon={<Trophy size={18} />} label="Challenges" to="/challenges" />
          <NavItem icon={<Smile size={18} />} label="Mood Tracker" to="/mood-tracker" />
          <NavItem icon={<List size={18} />} label="To-Do List" to="/to-do-list" />
          <NavItem icon={<DollarSign size={18} />} label="Budget Tracker" to="/budget-tracker" />
        </nav>

        {/* Footer lock label signoff signature container alignment marker layer */}
        <div className="text-xs text-center text-gray-400 border-t-2 pt-4 mt-4 border-pink-300 shrink-0">
          Private for two 💕
        </div>
      </div>
      
      {/* Responsive layout padding buffer offset block elements box spacer layout for main view wrapper routing views */}
      <div className="h-14 md:hidden block" />
    </>
  );
}