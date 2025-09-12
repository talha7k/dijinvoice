'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function SuppliersPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Users className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Suppliers</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supplier Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Supplier management features will be available soon. For now, you can add suppliers directly when creating invoices and quotes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}