// app/providers/RoleGuardProvider.tsx
"use client";

import { useRoleGuard } from "@/app/hooks/useRoleGuard";

export default function RoleGuardProvider({ children }: { children: React.ReactNode }) {
    useRoleGuard();
    return <>{children}</>;
}
