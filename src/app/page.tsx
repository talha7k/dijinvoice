'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { applyActionCode, checkActionCode } from 'firebase/auth';
import { Suspense } from 'react';
import { toast } from 'sonner';

function HomeContent() {
  const { user, loading, tenantId, emailVerified } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const checkForVerificationCode = async () => {
      // Check if there's a verification code in the URL
      const oobCode = searchParams.get('oobCode');
      const mode = searchParams.get('mode');

      if (mode === 'verifyEmail' && oobCode) {
        setIsVerifying(true);
        try {
          // Check the action code
          await checkActionCode(auth, oobCode);
          
          // Apply the action code (verify email)
          await applyActionCode(auth, oobCode);
          
          // Show success toast
          toast.success('Email Verified Successfully!', {
            description: 'Your email has been verified. You can now log in to your account.',
          });
          
          // Redirect to login page
          router.push('/login?verification=success');
        } catch (error) {
          console.error('Email verification error:', error);
          
          // Show error toast
          toast.error('Email Verification Failed', {
            description: 'The verification link may have expired or is invalid.',
          });
          
          // Redirect to login page
          router.push('/login?verification=error');
        }
      } else if (!loading) {
        // Normal routing logic
        if (user && tenantId) {
          if (emailVerified) {
            router.push('/dashboard');
          } else {
            router.push('/login?verification=true');
          }
        } else if (!user) {
          router.push('/login');
        }
      }
    };

    checkForVerificationCode();
  }, [user, loading, tenantId, emailVerified, router, searchParams]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Verifying your email...</p>
        </div>
      </div>
    );
  }

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

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
