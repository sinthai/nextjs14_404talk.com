"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard, type AuthGuardOptions } from "@/lib/auth/auth-guard";
import { Loader as Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  options?: AuthGuardOptions;
}

export function ProtectedRoute({ children, options }: ProtectedRouteProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const checkAccess = () => {
      const result = AuthGuard.canAccess(options);

      if (!result.allowed) {
        if (result.redirectTo) {
          router.push(result.redirectTo);
        }
        setIsAllowed(false);
      } else {
        setIsAllowed(true);
      }

      setIsChecking(false);
    };

    checkAccess();
  }, [router, options]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  if (!isAllowed) {
    return null;
  }

  return <>{children}</>;
}
