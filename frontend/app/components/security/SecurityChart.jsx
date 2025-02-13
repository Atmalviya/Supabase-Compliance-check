import { memo } from 'react';
import dynamic from 'next/dynamic';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import getPercentage from '../../../lib/utils/percentage';
import getStatusColor from '../../../lib/utils/status';

const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), {
  ssr: false
});

const ResponsiveContainer = dynamic(
  () => import('recharts').then(mod => mod.ResponsiveContainer),
  { ssr: false }
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
        <h4 className="text-gray-900 font-semibold mb-2">{label}</h4>
        <div className="space-y-1">
          <p className="text-sm text-gray-600">
            Enabled: {data.enabled}
          </p>
          <p className="text-sm text-gray-600">
            Total: {data.total}
          </p>
          <p className="text-sm text-gray-600">
            Percentage: {data.percentage}%
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const getBarColor = (percentage) => {
  const color = getStatusColor(percentage);
  return {
    success: '#22c55e',
    warning: '#eab308',
    danger: '#ef4444'
  }[color];
};

const SecurityChart = ({ stats }) => {
  const safeStats = {
    mfa: { enabled: 0, total: 0 },
    rls: { enabled: 0, total: 0 },
    pitr: { enabled: 0, total: 0 },
    ...stats
  };

  const chartData = [
    {
      name: 'MFA',
      enabled: safeStats.mfa.enabled,
      total: safeStats.mfa.total,
      percentage: getPercentage(safeStats.mfa.enabled, safeStats.mfa.total)
    },
    {
      name: 'RLS',
      enabled: safeStats.rls.enabled,
      total: safeStats.rls.total,
      percentage: getPercentage(safeStats.rls.enabled, safeStats.rls.total)
    },
    {
      name: 'PITR',
      enabled: safeStats.pitr.enabled,
      total: safeStats.pitr.total,
      percentage: getPercentage(safeStats.pitr.enabled, safeStats.pitr.total)
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Security Compliance Overview
      </h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis 
              type="category" 
              dataKey="name"
              width={80}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: '#f3f4f6' }}
            />
            <Legend />
            <Bar 
              dataKey="percentage" 
              name="Compliance Rate"
              radius={[0, 4, 4, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={getBarColor(entry.percentage)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default memo(SecurityChart); 