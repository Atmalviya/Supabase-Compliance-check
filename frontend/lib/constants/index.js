import { 
  RiShieldKeyholeLine,
  RiTableLine,
  RiClockwiseLine,
  RiDashboardLine,
  RiRobot2Line,
  RiBookLine
} from 'react-icons/ri';

export const CACHE_DURATION = 5 * 60 * 1000; 

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  AUTH: '/auth',
  MFA_STATUS: '/dashboard/mfa-status',
  RLS_STATUS: '/dashboard/rls-status',
  AI_ASSISTANT: '/ai',
  GUIDE: '/guide'
};

export const MENU_ITEMS = [
  {
    path: ROUTES.DASHBOARD,
    icon: RiDashboardLine,
    label: 'Overview'
  },
  {
    path: ROUTES.MFA_STATUS,
    icon: RiShieldKeyholeLine,
    label: 'MFA Status'
  },
  {
    path: ROUTES.RLS_STATUS,
    icon: RiTableLine,
    label: 'RLS Status'
  },
  {
    path: ROUTES.AI_ASSISTANT,
    icon: RiRobot2Line,
    label: 'AI Assistant'
  },
  {
    path: ROUTES.GUIDE,
    icon: RiBookLine,
    label: 'Setup Guide'
  }
];

export const QUERY_KEYS = {
  USER: 'user',
  SECURITY_STATS: 'securityStats',
  MFA_STATUS: 'mfaStatus',
  RLS_STATUS: 'rlsStatus'
};

export const STATUS_THRESHOLDS = {
  SUCCESS: 80,
  WARNING: 50
};

export const SECURITY_CARDS = {
  MFA: {
    title: 'MFA Status',
    icon: RiShieldKeyholeLine,
    description: (enabled, total) => 
      `${enabled} out of ${total} users have MFA enabled`
  },
  RLS: {
    title: 'RLS Status',
    icon: RiTableLine,
    description: (enabled, total) => 
      `${enabled} out of ${total} tables have RLS enabled`
  },
  PITR: {
    title: 'PITR Status',
    icon: RiClockwiseLine,
    description: (enabled, total) => 
      `${enabled} out of ${total} projects have PITR enabled`
  }
}; 