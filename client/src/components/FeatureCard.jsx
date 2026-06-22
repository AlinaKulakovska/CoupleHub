export default function FeatureCard({ icon, title }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center gap-2 hover:scale-105 transition cursor-pointer">
      <div className="text-pink-500 text-2xl">{icon}</div>
      <p className="font-medium">{title}</p>
    </div>
  );
}