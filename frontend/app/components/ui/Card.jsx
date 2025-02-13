import { memo } from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 ${className}`}>
      {children}
    </div>
  );
};

export default memo(Card); 