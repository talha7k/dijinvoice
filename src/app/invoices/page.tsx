'use client';

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Invoice, Tenant } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import EnglishInvoice from '@/components/templates/EnglishInvoice';
import ArabicInvoice from '@/components/templates/ArabicInvoice';

export default function InvoicesPage() {
  const { user, tenantId } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (!tenantId) return;

    // Fetch tenant data
    const fetchTenant = async () => {
      const tenantDoc = await getDoc(doc(db, 'tenants', tenantId));
      if (tenantDoc.exists()) {
        setTenant({
          id: tenantDoc.id,
          ...tenantDoc.data(),
          createdAt: tenantDoc.data().createdAt?.toDate(),
        } as Tenant);
      }
    };
    fetchTenant();

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
                        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Invoice Preview</DialogTitle>
                          </DialogHeader>
                          {selectedInvoice && tenant && (
                            <div>
                              <div className="flex gap-4 mb-4">
                                <Button
                                  variant={selectedInvoice.template === 'english' ? 'default' : 'outline'}
                                  onClick={() => {
                                    const updatedInvoice = { ...selectedInvoice, template: 'english' as const };
                                    setSelectedInvoice(updatedInvoice);
                                    updateDoc(doc(db, 'tenants', tenantId!, 'invoices', selectedInvoice.id), {
                                      template: 'english'
                                    });
                                  }}
                                >
                                  English Template
                                </Button>
                                <Button
                                  variant={selectedInvoice.template === 'arabic' ? 'default' : 'outline'}
                                  onClick={() => {
                                    const updatedInvoice = { ...selectedInvoice, template: 'arabic' as const };
                                    setSelectedInvoice(updatedInvoice);
                                    updateDoc(doc(db, 'tenants', tenantId!, 'invoices', selectedInvoice.id), {
                                      template: 'arabic'
                                    });
                                  }}
                                >
                                  Arabic Template
                                </Button>
                                <Button
                                  variant={selectedInvoice.includeQR ? 'default' : 'outline'}
                                  onClick={() => {
                                    const updatedInvoice = { ...selectedInvoice, includeQR: !selectedInvoice.includeQR };
                                    setSelectedInvoice(updatedInvoice);
                                    updateDoc(doc(db, 'tenants', tenantId!, 'invoices', selectedInvoice.id), {
                                      includeQR: !selectedInvoice.includeQR
                                    });
                                  }}
                                >
                                  {selectedInvoice.includeQR ? 'Hide' : 'Show'} ZATCA QR
                                </Button>
                              </div>
                              {selectedInvoice.template === 'arabic' ? (
                                <ArabicInvoice invoice={selectedInvoice} tenant={tenant} />
                              ) : (
                                <EnglishInvoice invoice={selectedInvoice} tenant={tenant} />
                              )}
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