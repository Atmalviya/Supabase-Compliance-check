import { memo } from 'react';
import { useAuth } from '../../../lib/hooks/useAuth';
import PageHeader from './PageHeader';

const DashboardLayout = ({
  title,
  onRefresh,
  isLoading,
  actions,
  children
}) => {
  const { isLoading: isAuthLoading } = useAuth();

  return (
    <div className="p-6">
      <PageHeader 
        title={title}
        onRefresh={onRefresh}
        isLoading={isLoading}
        actions={actions}
      />
      {children}
    </div>
  );
};

export default memo(DashboardLayout); 