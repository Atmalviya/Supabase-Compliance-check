'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/hooks/useAuth';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export default function Auth() {
  const router = useRouter();
  const { isLoading: isAuthChecking } = useAuth();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    supabaseUrl: '',
    serviceKey: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.auth.login(credentials);
      if (response.error) {
        throw new Error(response.error);
      }
      
      toast.success('Logged in successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your Supabase project credentials
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="supabaseUrl" className="block text-sm font-medium text-gray-700">
                Supabase Project URL
              </label>
              <div className="mt-1">
                <input
                  id="supabaseUrl"
                  name="supabaseUrl"
                  type="url"
                  required
                  value={credentials.supabaseUrl}
                  onChange={(e) => setCredentials(prev => ({ ...prev, supabaseUrl: e.target.value }))}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="https://your-project.supabase.co"
                />
              </div>
            </div>

            <div>
              <label htmlFor="serviceKey" className="block text-sm font-medium text-gray-700">
                Service Role Key
              </label>
              <div className="mt-1">
                <input
                  id="serviceKey"
                  name="serviceKey"
                  type="password"
                  required
                  value={credentials.serviceKey}
                  onChange={(e) => setCredentials(prev => ({ ...prev, serviceKey: e.target.value }))}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="eyJ0eXAiOiJKV1QiLC..."
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 