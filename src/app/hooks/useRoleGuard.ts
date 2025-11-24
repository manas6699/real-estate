"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface User {
  _id: string;
  name: string;
  phone: string;
  role: "admin" | "supervisor" | "telecaller" | "inventory";
}

/**
 * Role-based access guard for Next.js App Router
 */
export function useRoleGuard() {
  const router = useRouter();
  const pathname = usePathname(); 

  useEffect(() => {
    if (typeof window === "undefined" || !pathname) return;

    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    // If no user or token → clear and redirect
    if (!storedUser || !storedToken) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.replace("/login");
      return;
    }

    const user: User = JSON.parse(storedUser);
    const path = pathname.toLowerCase();

    const restrictedRoutes: Record<User["role"], string[]> = {
      admin: ["/supervisor", "/telecaller"],
      supervisor: ["/admin", "/telecaller"],
      telecaller: ["/admin", "/supervisor"],
      inventory: ["/admin", "/supervisor"],
    };

    const disallowedPaths = restrictedRoutes[user.role];
    const shouldBlock = disallowedPaths.some((r) => path.startsWith(r));

    if (shouldBlock) {
      alert("Access denied: You don't have permission to view this page.");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.replace("/login");
    }
  }, [pathname, router]);
}
