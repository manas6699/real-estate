
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export const useAuthRedirect = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log('token is  : ' , token);

    // If on login page and already logged in
    if (pathname === '/login' && token) {
      router.replace('/admin/LeadData');
    }

   if(pathname === '/login' && token){
     router.replace('/admin/Dashboard')
   }
  }, [pathname, router]);
};
