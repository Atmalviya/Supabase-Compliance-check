export default function StatCard({ title, value, percentage, icon, trend }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
          <i className={`bi ${icon} text-2xl`}></i>
        </div>
        <div className={`
          px-3 py-1 rounded-full text-sm font-medium
          ${trend === 'up' 
            ? 'bg-green-50 text-green-600' 
            : 'bg-red-50 text-red-600'
          }
        `}>
          {percentage}%
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-gray-600 text-sm mt-1">{title}</p>
    </div>
  );
} 