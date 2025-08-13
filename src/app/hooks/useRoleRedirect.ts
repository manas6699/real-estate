// hooks/useRoleRedirect.ts
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {jwtDecode} from 'jwt-decode';

type UserRole = 'admin' | 'telecaller' | 'salesperson';

interface UseRoleRedirectProps {
  role: UserRole | null;
  token: string | null; // add token prop
}

interface DecodedToken {
  exp: number; // expiration timestamp (seconds)
}

export default function useRoleRedirect({ role, token }: UseRoleRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    // ✅ 1. Check if token exists
    if (!token) return;

    try {
      // ✅ 2. Decode token
      const decoded: DecodedToken = jwtDecode(token);

      // ✅ 3. Check if token expired
      if (decoded.exp * 1000 < Date.now()) {
        console.warn('Token expired, skipping redirect.');
        return;
      }

      // ✅ 4. Redirect based on role
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
    } catch (error) {
      console.error('Invalid token', error);
    }
  }, [role, token, router]);
}
