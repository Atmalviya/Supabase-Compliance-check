'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { api } from '../../../lib/api';

export default function MFAStatus() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [securityStats, setSecurityStats] = useState({
    stats: { mfa: { enabled: 0, total: 0 } },
    users: []
  });

  useEffect(() => {
    checkUser();
    fetchSecurityStats();
  }, []);

  const checkUser = async () => {
    try {
      const { user } = await api.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/auth');
    }
  };

  const fetchSecurityStats = async () => {
    try {
      const response = await api.security.getStats();
      setSecurityStats(response);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to fetch security statistics');
    } finally {
      setLoading(false);
    }
  };

  const enableMFA = async (userId) => {
    try {
      setLoading(true);
      const response = await api.security.enableMFA(userId);
      
      setSecurityStats(prev => {
        const updatedUsers = prev.users.map(user => 
          user.id === userId 
            ? { 
                ...user, 
                hasMFA: true,
                app_metadata: {
                  ...user.app_metadata,
                  mfa_enabled: true
                }
              } 
            : user
        );
        
        return {
          ...prev,
          users: updatedUsers,
          stats: {
            ...prev.stats,
            mfa: {
              enabled: prev.stats.mfa.enabled + 1,
              total: prev.stats.mfa.total
            }
          }
        };
      });

      toast.success('MFA enabled successfully');
    } catch (error) {
      console.error('Error enabling MFA:', error);
      toast.error('Failed to enable MFA');
    } finally {
      setLoading(false);
    }
  };

  const getPercentage = (enabled, total) => {
    if (!total) return 0;
    return Math.round((enabled / total) * 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">MFA Status</h1>
        <button 
          onClick={fetchSecurityStats}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <i className="bi bi-arrow-clockwise mr-2"></i>
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-sm text-gray-500">Enabled Users</div>
          <div className="text-2xl font-bold text-indigo-600">
            {securityStats.stats.mfa.enabled}
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-sm text-gray-500">Total Users</div>
          <div className="text-2xl font-bold text-gray-900">
            {securityStats.stats.mfa.total}
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-sm text-gray-500">Compliance</div>
          <div className="text-2xl font-bold text-green-600">
            {getPercentage(securityStats.stats.mfa.enabled, securityStats.stats.mfa.total)}%
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MFA Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Sign In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {securityStats.users?.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <i className="bi bi-person text-indigo-400 mr-2"></i>
                      <span className="text-sm font-medium text-gray-900">
                        {user.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${user.app_metadata?.mfa_enabled 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {user.app_metadata?.mfa_enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.last_sign_in_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {!user.app_metadata?.mfa_enabled && (
                      <button
                        onClick={() => enableMFA(user.id)}
                        disabled={loading}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200"
                      >
                        <i className="bi bi-shield-plus mr-1.5"></i>
                        Enable MFA
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 