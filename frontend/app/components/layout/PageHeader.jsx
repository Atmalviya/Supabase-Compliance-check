import { memo } from 'react';
import Button from '../ui/Button';
import { RiRefreshLine } from 'react-icons/ri';

function PageHeader({ 
  title, 
  onRefresh, 
  isLoading = false,
  actions 
}) {
  return (
    <div className="mb-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <div className="flex gap-3">
        {actions}
        {onRefresh && (
          <Button
            onClick={onRefresh}
            isLoading={isLoading}
            icon={RiRefreshLine}
          >
            Refresh
          </Button>
        )}
      </div>
    </div>
  );
}

export default memo(PageHeader); 