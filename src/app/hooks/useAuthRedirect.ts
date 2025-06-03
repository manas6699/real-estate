
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export const useAuthRedirect = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log('token : ' , token);

    // If on login page and already logged in
    if (pathname === '/login' && token) {
      router.replace('/admin/LeadData');
    }

    // If on protected page and not logged in
    if (pathname.startsWith('/admin') && !token) {
      router.replace('/login');
    }
  }, [pathname, router]);
};
