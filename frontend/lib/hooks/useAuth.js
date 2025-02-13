import { useQuery } from '@tanstack/react-query';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { api } from '../api';

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: () => api.auth.getUser().then(res => res.user),
    retry: false,
    staleTime: 5 * 60 * 1000, 
  });

  useEffect(() => {
    if (!isLoading) {
      if (isError && pathname !== '/auth') {
        router.push('/auth');
      } else if (user && pathname === '/auth') {
        router.push('/dashboard');
      }
    }
  }, [isError, isLoading, user, router, pathname]);

  return { user, isLoading };
} 