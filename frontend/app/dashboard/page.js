'use client';
import { useSecurityStats } from '../../lib/hooks/useSecurityStats';
import { useAuth } from '../../lib/hooks/useAuth';
import DashboardLayout from '../components/layout/DashboardLayout';
import SecurityStatusCard from '../components/security/SecurityStatusCard';
import SecurityChart from '../components/security/SecurityChart';
import { SECURITY_CARDS } from '../../lib/constants';
import { CardSkeleton, ChartSkeleton } from '../components/ui/Skeletons';

export default function Dashboard() {
  const { isLoading: isAuthLoading } = useAuth();
  const { 
    data: securityStats,
    isLoading: isStatsLoading,
    isError,
    refetch
  } = useSecurityStats();

  const isLoading = isAuthLoading || isStatsLoading;

  const stats = securityStats?.stats || {
    mfa: { enabled: 0, total: 0 },
    rls: { enabled: 0, total: 0 },
    pitr: { enabled: 0, total: 0 }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        
        <ChartSkeleton />
      </div>
    );
  }

  return (
    <DashboardLayout
      title="Security Overview"
      onRefresh={refetch}
      isLoading={false}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {Object.entries(SECURITY_CARDS).map(([key, config]) => (
          <SecurityStatusCard
            key={key}
            {...config}
            stats={stats[key.toLowerCase()]}
          />
        ))}
      </div>

      <SecurityChart stats={stats} />
    </DashboardLayout>
  );
} 