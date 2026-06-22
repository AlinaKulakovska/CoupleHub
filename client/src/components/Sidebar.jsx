import { Home, Utensils, Heart, MessageCircle, Image, ListTodo, Trophy, Smile } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col p-6">
      
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10">
        <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center">
          ❤️
        </div>
        <div>
          <h1 className="font-bold text-lg">CoupleHub</h1>
          <p className="text-xs text-gray-500">Janik & Alina ✨</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-4 text-gray-600">
        <NavItem icon={<Home size={18} />} label="Home" active />
        <NavItem icon={<Utensils size={18} />} label="Meals" />
        <NavItem icon={<Heart size={18} />} label="Dates" />
        <NavItem icon={<MessageCircle size={18} />} label="Truth/Dare" />
        <NavItem icon={<Smile size={18} />} label="Questions" />
        <NavItem icon={<Image size={18} />} label="Memories" />
        <NavItem icon={<ListTodo size={18} />} label="Bucket List" />
        <NavItem icon={<Trophy size={18} />} label="Challenges" />
      </nav>

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