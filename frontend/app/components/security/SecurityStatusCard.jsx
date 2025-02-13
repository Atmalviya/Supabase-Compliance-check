import { memo } from 'react';
import getPercentage from '../../../lib/utils/percentage';
import getStatusColor from '../../../lib/utils/status';

const SecurityStatusCard = ({
  title,
  icon: Icon,
  stats,
  description
}) => {
  const safeStats = stats || { enabled: 0, total: 0 };
  const percentage = getPercentage(safeStats.enabled, safeStats.total);
  const statusColor = getStatusColor(percentage);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          {Icon && <Icon className="text-2xl text-indigo-600 mr-3" />}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium
          ${statusColor === 'success' ? 'bg-green-100 text-green-800' :
            statusColor === 'warning' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'}`}
        >
          {percentage}%
        </span>
      </div>
      <p className="text-gray-600 mb-4">
        {description(safeStats.enabled, safeStats.total)}
      </p>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${
            statusColor === 'success' ? 'bg-green-500' :
            statusColor === 'warning' ? 'bg-yellow-500' :
            'bg-red-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default memo(SecurityStatusCard); 