'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Quote, QuoteItem } from '@/lib/types';

interface QuoteFormProps {
  onSubmit: (quote: Omit<Quote, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => void;
}

export default function QuoteForm({ onSubmit }: QuoteFormProps) {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState('');

  const addItem = () => {
    setItems([...items, {
      id: Date.now().toString(),
      type: 'product',
      name: '',
      description: '',
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
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
      </div>
      <div>
        <Label htmlFor="clientAddress">Client Address</Label>
        <Input
          id="clientAddress"
          value={clientAddress}
          onChange={(e) => setClientAddress(e.target.value)}
        />
      </div>

      <div>
        <Label>Items</Label>
        {items.map((item, index) => (
          <div key={item.id} className="border p-4 mb-2 rounded">
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Name"
                value={item.name}
                onChange={(e) => updateItem(index, 'name', e.target.value)}
              />
              <Input
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
              />
              <Input
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Unit Price"
                value={item.unitPrice}
                onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}
              />
            </div>
            <Button type="button" variant="destructive" onClick={() => removeItem(index)} className="mt-2">
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" onClick={addItem}>Add Item</Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="taxRate">Tax Rate (%)</Label>
          <Input
            id="taxRate"
            type="number"
            step="0.01"
            value={taxRate}
            onChange={(e) => setTaxRate(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <Label>Total: ${total.toFixed(2)}</Label>
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <Button type="submit">Create Quote</Button>
    </form>
  );
}