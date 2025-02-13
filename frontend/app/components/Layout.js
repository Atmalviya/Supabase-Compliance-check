'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Sidebar from './layout/Sidebar';
import { RiMenuUnfoldLine } from 'react-icons/ri';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage = pathname === '/auth';
  const isRootPage = pathname === '/';

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isAuthPage || isRootPage) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {children}
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`
        fixed top-0 left-0 h-full z-50
        ${isMobile 
          ? `transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
          : ''
        }
      `}>
        <Sidebar 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen}
          isMobile={isMobile}
        />
      </div>

      <div className={`
        min-h-screen
        ${isMobile ? '' : 'ml-72'}
      `}>
        {isMobile && (
          <nav className="sticky top-0 bg-white shadow-sm h-16">
            <div className="h-full px-4 flex items-center justify-between">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <RiMenuUnfoldLine size={24} />
              </button>
              
              <span className="text-lg font-semibold text-gray-800">
                Supabase Security
              </span>

              <div className="w-10" />
            </div>
          </nav>
        )}

        <main className="p-4 lg:p-6">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 