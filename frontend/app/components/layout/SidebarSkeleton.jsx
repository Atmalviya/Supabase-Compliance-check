export default function SidebarSkeleton() {
  return (
    <div className="h-full bg-slate-800 flex flex-col w-72">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700">
        <div className="h-6 w-32 bg-slate-700 rounded animate-pulse"></div>
      </div>

      {/* Navigation Skeleton */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-4">
          {[...Array(4)].map((_, i) => (
            <li key={i}>
              <div className="flex items-center h-10">
                <div className="h-5 w-5 bg-slate-700 rounded mr-3 animate-pulse"></div>
                <div className="h-5 w-24 bg-slate-700 rounded animate-pulse"></div>
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer Skeleton */}
      <div className="border-t border-slate-700 p-4">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-slate-700 rounded-full animate-pulse"></div>
          <div className="ml-3">
            <div className="h-4 w-20 bg-slate-700 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-16 bg-slate-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 