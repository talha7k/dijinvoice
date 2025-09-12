'use client';

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Invoice } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

export default function InvoicesPage() {
  const { user, tenantId } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (!tenantId) return;

    const q = query(collection(db, 'tenants', tenantId, 'invoices'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const invoicesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        dueDate: doc.data().dueDate?.toDate(),
      })) as Invoice[];
      setInvoices(invoicesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [tenantId]);

  const handleStatusChange = async (invoiceId: string, status: Invoice['status']) => {
    if (!tenantId) return;

    const invoiceRef = doc(db, 'tenants', tenantId, 'invoices', invoiceId);
    await updateDoc(invoiceRef, { status, updatedAt: new Date() });
  };

  if (!user) return <div>Please log in</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Invoices</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.clientName}</TableCell>
                  <TableCell>${invoice.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={
                      invoice.status === 'paid' ? 'default' :
                      invoice.status === 'overdue' ? 'destructive' :
                      'secondary'
                    }>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{invoice.dueDate?.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedInvoice(invoice)}>
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Invoice Details</DialogTitle>
                          </DialogHeader>
                          {selectedInvoice && (
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold">Client: {selectedInvoice.clientName}</h3>
                                <p>Email: {selectedInvoice.clientEmail}</p>
                                <p>Address: {selectedInvoice.clientAddress}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold">Items:</h4>
                                <ul>
                                  {selectedInvoice.items.map((item, index) => (
                                    <li key={index}>
                                      {item.name} - Qty: {item.quantity} - ${item.total.toFixed(2)}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p>Subtotal: ${selectedInvoice.subtotal.toFixed(2)}</p>
                                <p>Tax: ${selectedInvoice.taxAmount.toFixed(2)}</p>
                                <p>Total: ${selectedInvoice.total.toFixed(2)}</p>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      {invoice.status === 'draft' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(invoice.id, 'sent')}
                        >
                          Mark as Sent
                        </Button>
                      )}
                      {invoice.status === 'sent' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(invoice.id, 'paid')}
                        >
                          Mark as Paid
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}