'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { user, loading, tenantId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user && tenantId) {
        router.push('/dashboard');
      } else if (!user) {
        router.push('/login');
      }
    }
  }, [user, loading, tenantId, router]);

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">DijiInvoice</CardTitle>
          <CardDescription>
            Multi-tenant invoice management platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => router.push('/login')} className="w-full">
            Sign In
          </Button>
          <Button onClick={() => router.push('/register')} variant="outline" className="w-full">
            Sign Up
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
