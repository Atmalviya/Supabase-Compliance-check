import { toast } from 'react-hot-toast';

export const showToast = {
  success: (message) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
      icon: '✅',
      style: {
        background: '#333',
        color: '#fff',
        borderRadius: '8px',
      },
    });
  },
  
  error: (message) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
      icon: '❌',
      style: {
        background: '#333',
        color: '#fff',
        borderRadius: '8px',
      },
    });
  },
  
  loading: (message) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#333',
        color: '#fff',
        borderRadius: '8px',
      },
    });
  }
}; 