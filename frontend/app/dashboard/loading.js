import { CardSkeleton, ChartSkeleton } from '../components/ui/Skeletons';

export default function DashboardLoading() {
  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>
      
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      
      {/* Chart Skeleton */}
      <ChartSkeleton />
    </div>
  );
} 