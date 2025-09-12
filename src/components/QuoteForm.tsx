'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Combobox } from '@/components/ui/combobox';
import { Quote, QuoteItem } from '@/types';
import {
  sampleCustomers,
  sampleProductsServices,
  getCustomerOptions,
  getProductServiceOptions,
  getCustomerById,
  getProductServiceById
} from '@/lib/sample-data';

interface QuoteFormProps {
  onSubmit: (quote: Omit<Quote, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => void;
}

export default function QuoteForm({ onSubmit }: QuoteFormProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState('');

  // Handle customer selection
  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomerId(customerId);
    const customer = getCustomerById(sampleCustomers, customerId);
    if (customer) {
      setClientName(customer.name);
      setClientEmail(customer.email);
      setClientAddress(customer.address || '');
    }
  };

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
      <div>
        <Label>Select Customer</Label>
        <Combobox
          options={getCustomerOptions(sampleCustomers)}
          value={selectedCustomerId}
          onValueChange={handleCustomerSelect}
          placeholder="Choose a customer..."
          searchPlaceholder="Search customers..."
          emptyMessage="No customers found."
          buttonWidth="w-full"
        />
      </div>

      {selectedCustomerId && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                readOnly
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
                readOnly
              />
            </div>
          </div>
          <div>
            <Label htmlFor="clientAddress">Client Address</Label>
            <Input
              id="clientAddress"
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              readOnly
            />
          </div>
        </>
      )}

      <div>
        <Label>Items</Label>

        {/* Add item from catalog */}
        <div className="mb-4">
          <Label className="text-sm text-muted-foreground">Add from catalog:</Label>
          <Combobox
            options={getProductServiceOptions(sampleProductsServices)}
            value=""
            onValueChange={(value) => {
              addItemFromCatalog(value);
            }}
            placeholder="Select product or service..."
            searchPlaceholder="Search products and services..."
            emptyMessage="No items found."
            buttonWidth="w-full"
          />
        </div>

        {items.map((item, index) => (
          <div key={item.id} className="border p-4 mb-2 rounded">
            <div className="grid grid-cols-2 gap-2 mb-2">
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
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Input
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Unit Price"
                value={item.unitPrice}
                onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
              />
              <div className="flex items-center">
                <span className="text-sm font-medium">Total: ${item.total.toFixed(2)}</span>
              </div>
            </div>
            <Button type="button" variant="destructive" onClick={() => removeItem(index)} className="mt-2">
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" onClick={addItem} className="mt-2">Add Custom Item</Button>
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