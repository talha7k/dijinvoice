'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Dashboard() {
  const { user, tenantId } = useAuth();

  if (!user || !tenantId) return <div>Access denied</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Quotes</CardTitle>
            <CardDescription>Manage your quotes</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/quotes">
              <Button className="w-full">View Quotes</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Manage your invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/invoices">
              <Button className="w-full">View Invoices</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payments</CardTitle>
            <CardDescription>Track payments</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/payments">
              <Button className="w-full">View Payments</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Products & Services</CardTitle>
            <CardDescription>Manage your catalog</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/products">
              <Button className="w-full">View Catalog</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}