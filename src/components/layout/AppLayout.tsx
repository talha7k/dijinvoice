'use client';

import { useAuth } from '@/contexts/AuthContext';
import { CollapsibleSidebar } from '@/components/ui/collapsible-sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface AppLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AppLayout({ children, requireAuth = true }: AppLayoutProps) {
  const { user, loading } = useAuth();

  if (requireAuth) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen bg-background">
          <CollapsibleSidebar />
          <main className="flex-1 md:ml-16 lg:ml-64 overflow-auto">
            {children}
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  // For public pages (login, register), don't show sidebar
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}