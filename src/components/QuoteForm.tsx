'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Quote, QuoteItem } from '@/types';

interface QuoteFormProps {
  onSubmit: (quote: Omit<Quote, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Partial<Quote>;
}

export default function QuoteForm({ onSubmit, initialData }: QuoteFormProps) {
  const [clientName, setClientName] = useState(initialData?.clientName || '');
  const [clientEmail, setClientEmail] = useState(initialData?.clientEmail || '');
  const [clientAddress, setClientAddress] = useState(initialData?.clientAddress || '');
  const [items, setItems] = useState<QuoteItem[]>(initialData?.items || []);
  const [taxRate, setTaxRate] = useState(initialData?.taxRate || 0);
  const [notes, setNotes] = useState(initialData?.notes || '');

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      clientName,
      clientEmail,
      clientAddress,
      items,
      subtotal,
      taxRate,
      taxAmount,
      total,
      status: 'draft',
      notes,
    });
  };

  const addItem = () => {
    setItems([...items, {
      id: Date.now().toString(),
      type: 'product',
      name: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    }]);
  };

  const updateItem = (index: number, field: keyof QuoteItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="clientName">Client Name</Label>
        <Input
          id="clientName"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="clientEmail">Client Email</Label>
        <Input
          id="clientEmail"
          type="email"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="clientAddress">Client Address</Label>
        <Textarea
          id="clientAddress"
          value={clientAddress}
          onChange={(e) => setClientAddress(e.target.value)}
        />
      </div>

      <div>
        <Label>Items</Label>
        {items.map((item, index) => (
          <div key={item.id} className="flex gap-2 mb-2">
            <Input
              placeholder="Name"
              value={item.name}
              onChange={(e) => updateItem(index, 'name', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Qty"
              value={item.quantity}
              onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
            />
            <Input
              type="number"
              placeholder="Price"
              value={item.unitPrice}
              onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}
            />
            <span>${item.total.toFixed(2)}</span>
            <Button type="button" variant="destructive" onClick={() => removeItem(index)}>
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addItem}>
          Add Item
        </Button>
      </div>

      <div>
        <Label htmlFor="taxRate">Tax Rate (%)</Label>
        <Input
          id="taxRate"
          type="number"
          value={taxRate}
          onChange={(e) => setTaxRate(parseFloat(e.target.value))}
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="text-right">
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Tax: ${taxAmount.toFixed(2)}</p>
        <p>Total: ${total.toFixed(2)}</p>
      </div>

      <Button type="submit">Save Quote</Button>
    </form>
  );
}