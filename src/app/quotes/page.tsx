'use client';

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Quote } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import QuoteForm from '@/components/QuoteForm';

export default function QuotesPage() {
  const { user, tenantId } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!tenantId) return;

    const q = query(collection(db, 'tenants', tenantId, 'quotes'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const quotesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        validUntil: doc.data().validUntil?.toDate(),
      })) as Quote[];
      setQuotes(quotesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [tenantId]);

  const handleCreateQuote = async (quoteData: Omit<Quote, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => {
    if (!tenantId) return;

    await addDoc(collection(db, 'tenants', tenantId, 'quotes'), {
      ...quoteData,
      tenantId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setDialogOpen(false);
  };

  const handleConvertToInvoice = async (quoteId: string) => {
    if (!tenantId) return;

    const quoteRef = doc(db, 'tenants', tenantId, 'quotes', quoteId);
    await updateDoc(quoteRef, { status: 'converted' });

    const quote = quotes.find(q => q.id === quoteId);
    if (quote) {
      await addDoc(collection(db, 'tenants', tenantId, 'invoices'), {
        ...quote,
        quoteId,
        status: 'draft',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        template: 'english', // default template
        includeQR: false, // default no QR
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  };

  if (!user) return <div>Please log in</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quotes</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Quote</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Quote</DialogTitle>
            </DialogHeader>
            <QuoteForm onSubmit={handleCreateQuote} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell>{quote.clientName}</TableCell>
                  <TableCell>${quote.total.toFixed(2)}</TableCell>
                  <TableCell>{quote.status}</TableCell>
                  <TableCell>{quote.createdAt?.toLocaleDateString()}</TableCell>
                  <TableCell>
                    {quote.status !== 'converted' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConvertToInvoice(quote.id)}
                      >
                        Convert to Invoice
                      </Button>
                    )}
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