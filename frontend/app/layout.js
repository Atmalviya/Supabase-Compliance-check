import { Suspense } from 'react';
import './globals.css';
import Layout from './components/Layout';
import QueryProvider from './components/providers/QueryProvider';
import { AppProvider } from '../lib/context/AppContext';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Supabase Security Assistant',
  description: 'Get AI-powered security recommendations for your Supabase setup',
};

function LoadingFallback() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link 
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
          rel="stylesheet"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <AppProvider>
          <QueryProvider>
            <Suspense fallback={<LoadingFallback />}>
              <Layout>{children}</Layout>
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#333',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#22c55e',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </Suspense>
          </QueryProvider>
        </AppProvider>
      </body>
    </html>
  );
} 