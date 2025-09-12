'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Receipt, Package, CreditCard, Users } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading, tenantId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !tenantId)) {
      router.push('/login');
    }
  }, [user, loading, tenantId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user || !tenantId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <Button onClick={() => router.push('/logout')} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="ml-2">Quotes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Create and manage quotes for your clients
                </CardDescription>
                <Button className="mt-4" onClick={() => router.push('/dashboard/quotes')}>
                  Manage Quotes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Receipt className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="ml-2">Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Convert quotes to invoices and track payments
                </CardDescription>
                <Button className="mt-4" onClick={() => router.push('/dashboard/invoices')}>
                  Manage Invoices
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="ml-2">Products & Services</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Manage your product catalog and services
                </CardDescription>
                <Button className="mt-4" onClick={() => router.push('/dashboard/products')}>
                  Manage Catalog
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="ml-2">Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Track partial payments and payment history
                </CardDescription>
                <Button className="mt-4" onClick={() => router.push('/dashboard/payments')}>
                  View Payments
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="ml-2">Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Manage your client information
                </CardDescription>
                <Button className="mt-4" onClick={() => router.push('/dashboard/clients')}>
                  Manage Clients
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}