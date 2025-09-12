'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Combobox } from '@/components/ui/combobox';
import ItemList from '@/components/ItemList';
import ClientInfo from '@/components/ClientInfo';
import { Invoice, QuoteItem } from '@/types';
import {
  sampleProductsServices,
  getProductOptions,
  getServiceOptions,
  getProductServiceById
} from '@/lib/sample-data';

interface InvoiceFormProps {
  onSubmit: (invoice: Omit<Invoice, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => void;
}

export default function InvoiceForm({ onSubmit }: InvoiceFormProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientVAT, setClientVAT] = useState<string | undefined>('');

  const [items, setItems] = useState<QuoteItem[]>([]);
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30); // Default to 30 days from now
    return date.toISOString().split('T')[0];
  });


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

  const addItemFromCatalog = (itemId: string) => {
    const catalogItem = getProductServiceById(sampleProductsServices, itemId);
    if (catalogItem) {
      setItems([...items, {
        id: Date.now().toString(),
        type: catalogItem.type,
        productId: catalogItem.type === 'product' ? catalogItem.id : undefined,
        serviceId: catalogItem.type === 'service' ? catalogItem.id : undefined,
        name: catalogItem.name,
        description: catalogItem.description || '',
        quantity: 1,
        unitPrice: catalogItem.price,
        total: catalogItem.price,
      }]);
    }
  };

  const updateItem = (index: number, field: keyof QuoteItem, value: string | number) => {
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
      clientVAT,
      items,
      subtotal,
      taxRate,
      taxAmount,
      total,
      status: 'draft',
      dueDate: new Date(dueDate),
      notes,
      template: 'english' as const,
      includeQR: false,
    } as Omit<Invoice, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ClientInfo
        selectedCustomerId={selectedCustomerId}
        clientName={clientName}
        clientEmail={clientEmail}
        clientAddress={clientAddress}
        clientVAT={clientVAT}
        showVAT={true}
        onCustomerSelect={setSelectedCustomerId}
        onClientNameChange={setClientName}
        onClientEmailChange={setClientEmail}
        onClientAddressChange={setClientAddress}
        onClientVATChange={setClientVAT}
      />

      <div>
        <Label>Items</Label>

        {/* Add item from catalog */}
        <div className="mb-4 space-y-2">
          <Label className="text-sm text-muted-foreground">Add from catalog:</Label>
          <div className="grid grid-cols-2 gap-2">
            <Combobox
              options={getProductOptions(sampleProductsServices)}
              value=""
              onValueChange={(value) => {
                addItemFromCatalog(value);
              }}
              placeholder="Select product..."
              searchPlaceholder="Search products..."
              emptyMessage="No products found."
              buttonWidth="w-full"
            />
            <Combobox
              options={getServiceOptions(sampleProductsServices)}
              value=""
              onValueChange={(value) => {
                addItemFromCatalog(value);
              }}
              placeholder="Select service..."
              searchPlaceholder="Search services..."
              emptyMessage="No services found."
              buttonWidth="w-full"
            />
          </div>
        </div>

        <ItemList
          items={items}
          mode="editable"
          onUpdate={updateItem}
          onRemove={removeItem}
        />
        <Button type="button" onClick={addItem} className="mt-2">Add Custom Item</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
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
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <div className="flex items-end">
          <span className="text-lg font-bold">Total: ${total.toFixed(2)}</span>
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

      <Button type="submit">Create Invoice</Button>
    </form>
  );
}