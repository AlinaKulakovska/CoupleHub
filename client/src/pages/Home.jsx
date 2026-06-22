import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import FeatureCard from "../components/FeatureCard";

export default function Home() {
  return (
    <div className="flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 p-8 space-y-6">

        {/* Header */}
        <Header />

        {/* Stats */}
        <div className="flex gap-4">
          <StatCard value="1401" label="Days Together 💕" />
          <StatCard value="0" label="Days to Anniversary 🎉" />
        </div>

        {/* Daily Question */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-pink-500 text-sm uppercase">
            Today's Deep Question
          </p>
          <p className="text-lg font-medium mt-2">
            If you could give your younger self one piece of advice, what would it be?
          </p>
          <p className="text-pink-500 mt-2 text-sm cursor-pointer">
            Answer together →
          </p>
        </div>

        {/* Explore */}
        <div>
          <h2 className="font-semibold mb-4">Explore</h2>

          <div className="grid grid-cols-4 gap-4">

            <FeatureCard icon="🍽️" title="Meals" />
            <FeatureCard icon="❤️" title="Dates" />
            <FeatureCard icon="🎲" title="Truth/Dare" />
            <FeatureCard icon="💬" title="Questions" />

            <FeatureCard icon="📷" title="Memories" />
            <FeatureCard icon="📋" title="Bucket List" />
            <FeatureCard icon="🏆" title="Challenges" />
            <FeatureCard icon="😊" title="Mood" />

          </div>
        </div>

      </div>
    </div>
  );
}