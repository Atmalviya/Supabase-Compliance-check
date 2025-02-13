'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { api } from '../../../lib/api';
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { 
  RiDashboardLine, 
  RiShieldKeyholeLine, 
  RiTableLine, 
  RiRobot2Line,
  RiLogoutBoxRLine,
  RiCloseLine,
  RiBookLine
} from 'react-icons/ri';
import Image from 'next/image';
import SidebarSkeleton from './SidebarSkeleton';
import { showToast } from '../../../lib/utils/toast';

const menuItems = [
  {
    path: '/dashboard',
    icon: RiDashboardLine,
    label: 'Overview'
  },
  {
    path: '/dashboard/mfa-status',
    icon: RiShieldKeyholeLine,
    label: 'MFA Status'
  },
  {
    path: '/dashboard/rls-status',
    icon: RiTableLine,
    label: 'RLS Status'
  },
  {
    path: '/ai',
    icon: RiRobot2Line,
    label: 'AI Assistant'
  },
  {
    path: '/guide',
    icon: RiBookLine,
    label: 'Setup Guide'
  }
];

export default function Sidebar({ isOpen, setIsOpen, isMobile }) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const { user } = await api.auth.getUser();
        if (user) {
          setAdminInfo(user);
        }
      } catch (error) {
        return null;
      } finally {
        setLoading(false);
      }
    };

    fetchAdminInfo();
  }, []);

  if (loading) {
    return <SidebarSkeleton />;
  }

  const handleLogout = async () => {
    const loadingToast = showToast.loading('Logging out...');
    
    try {
      await api.auth.logout();
      queryClient.clear();
      localStorage.removeItem('sessionToken');
      
      toast.dismiss(loadingToast);
      showToast.success('Successfully logged out');
      
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } catch (error) {
      toast.dismiss(loadingToast);
      showToast.error('Failed to logout. Please try again.');
      console.error('Logout error:', error);
    }
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <div className="h-full bg-slate-800 flex flex-col w-72">
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700">
        <span className="text-white text-lg font-semibold">
          Supabase Security
        </span>
        
        {isMobile && (
          <button 
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-white"
          >
            <RiCloseLine size={24} />
          </button>
        )}
      </div>

      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`
                  flex items-center px-4 py-2
                  transition-colors duration-200
                  no-underline
                  ${pathname === item.path 
                    ? 'text-white bg-blue-600' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }
                `}
                onClick={handleLinkClick}
              >
                <item.icon size={20} className="mr-3" />
                <span className="no-underline">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-slate-700 p-4">
        <div className="flex items-center">
          {adminInfo?.avatar_url && (
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={adminInfo.avatar_url}
                alt="User avatar"
                fill
                sizes="40px"
                className="object-cover"
                priority={false}
              />
            </div>
          )}
          <div>
            <div className="text-white text-sm">
              {adminInfo?.project_url?.replace('https://', '')?.split('.')[0] || 'Admin'}
            </div>
            <button 
              onClick={handleLogout}
              className="text-slate-400 text-md hover:text-white flex items-center mt-1"
            >
              Logout
              <RiLogoutBoxRLine size={24} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 