export default function StatCard({ value, label }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 text-center flex-1">
      <h2 className="text-2xl font-bold text-pink-500">{value}</h2>
      <p className="text-gray-500 text-sm">{label}</p>
    </div>
  );
}