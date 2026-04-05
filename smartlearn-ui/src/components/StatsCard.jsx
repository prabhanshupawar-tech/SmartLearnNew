function StatsCard({ title, value, sub }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
      <p className="text-green-500 text-sm">{sub}</p>
    </div>
  );
}

export default StatsCard;