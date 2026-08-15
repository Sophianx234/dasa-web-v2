"use client";
import { usePathname } from "next/navigation";

export function LayoutVisibility({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // List of paths where navbar/footer should be hidden
  const hidePaths = ['/login', '/signup', '/forgotpassword', '/resetpassword', '/reset-password', '/admin'];
  
  // Check if current path starts with any of the hidden paths
  const shouldHide = hidePaths.some(path => pathname.startsWith(path));

  if (shouldHide) return null;
  
  return <>{children}</>;
}
