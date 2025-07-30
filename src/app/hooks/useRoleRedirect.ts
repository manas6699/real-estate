// hooks/useRoleRedirect.ts
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

type UserRole = 'admin' | 'telecaller' | 'salesperson'; // extend if needed

interface UseRoleRedirectProps {
  role: UserRole | null;
}

export default function useRoleRedirect({ role }: UseRoleRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    if (!role) return;

    switch (role) {
      case 'admin':
        router.push('/admin/Dashboard');
        break;
      case 'telecaller':
        router.push('/telecaller/Dashboard');
        break;
      case 'salesperson':
        router.push('/sales/Dashboard');
        break;
      default:
        router.push('/unauthorized');
    }
  }, [role, router]);
}
