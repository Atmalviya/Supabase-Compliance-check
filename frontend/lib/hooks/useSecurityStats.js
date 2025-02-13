import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { QUERY_KEYS } from '../constants';

export function useSecurityStats() {
  return useQuery({
    queryKey: [QUERY_KEYS.SECURITY_STATS],
    queryFn: () => api.security.getStats(),
    refetchInterval: 30000,
    staleTime: 10000,
    select: (data) => ({
      ...data,
      stats: {
        mfa: { ...data.stats.mfa },
        rls: { ...data.stats.rls },
        pitr: { ...data.stats.pitr }
      }
    })
  });
} 