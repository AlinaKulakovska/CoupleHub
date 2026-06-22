import Header from "../components/Header";
import FeatureCard from "../components/FeatureCard";
import TimeElapsedWidget from "../components/TimeElapsedWidget";

import { NavLink } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex">
      {/* Main */}
      <div className="flex-1 p-8 space-y-6">
        {/* Header */}
        <Header />
        {/* Stats */}
        <div className="flex gap-4">
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center flex-1">
            <p className="text-gray-500 text-sm">We are Together for:</p>
            <h2 className="text-2xl font-bold text-pink-500">
        <TimeElapsedWidget/> :) </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center flex-1">
            <h2 className="text-2xl font-bold text-pink-500"></h2>
            <p className="text-gray-500 text-sm"></p>
          </div>
        </div>

        {/* Daily Question */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-pink-500 text-sm uppercase">
            Today's Deep Question
          </p>
          <p className="text-lg font-medium mt-2">
            If you could give your younger self one piece of advice, what would
            it be?
          </p>
          <p className="text-pink-500 mt-2 text-sm cursor-pointer">
            Answer together →
          </p>
        </div>
        <p>partners mood???</p>
      </div>
    </div>
  );
}
