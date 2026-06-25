import TimeOfDayWidget from "./TimeOfDayWidget";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { user } = useContext(AuthContext);

  const coupleData = user?.couple;
  
  // Extract IDs safely whether they are full objects or raw string values
  const user1Id = coupleData?.user1?._id || coupleData?.user1;
  const user2Id = coupleData?.user2?._id || coupleData?.user2;
  const loggedInUserId = user?.id || user?._id;

  // Cast everything explicitly to strings to avoid Mongoose ObjectId comparison bugs
  const isUser1 = String(loggedInUserId) === String(user1Id);
  const partnerObj = isUser1 ? coupleData?.user2 : coupleData?.user1;

  return (
    <div className="bg-linear-to-r from-pink-100 to-purple-100 rounded-3xl p-8 shadow-sm">
      <p className="text-gray-500 uppercase text-xs mt-1">
        Good <TimeOfDayWidget />
      </p>
      <h1 className="text-3xl font-bold">
        {user?.name || "User"}{" "}
        <span className="text-pink-500">
          {" "}
          & {partnerObj?.name || "Waiting for partner..."}
        </span>
      </h1>
      
      <p className="text-gray-600 mt-2">
        In a world full of ordinary, you're my extraordinary. ✨
      </p>
    </div>
  );
}