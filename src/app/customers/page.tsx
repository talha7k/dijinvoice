'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Users } from 'lucide-react';
import { ActionButtons } from '@/components/ui/action-buttons';
import { sampleCustomers } from '@/lib/sample-data';
import { Customer } from '@/types';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(
    sampleCustomers.map(c => ({
      id: c.id,
      name: c.name,
      email: c.email,
      address: c.address || '',
      phone: c.phone || '',
      vatNumber: '',
      tenantId: 'default',
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    vatNumber: '',
  });

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      email: '',
      address: '',
      phone: '',
      vatNumber: '',
    });
    setIsDialogOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      address: customer.address || '',
      phone: customer.phone || '',
      vatNumber: customer.vatNumber || '',
    });
    setIsDialogOpen(true);
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  const handleSaveCustomer = () => {
    if (editingCustomer) {
      // Update existing customer
      setCustomers(customers.map(c =>
        c.id === editingCustomer.id
          ? { ...c, ...formData, updatedAt: new Date() }
          : c
      ));
    } else {
      // Add new customer
      const newCustomer: Customer = {
        id: `c${Date.now()}`,
        ...formData,
        tenantId: 'default',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCustomers([...customers, newCustomer]);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Customers</h1>
        </div>
        <Button onClick={handleAddCustomer}>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
        </CardHeader>
        <CardContent>
          {customers.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No customers found. Add your first customer to get started.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>VAT Number</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone || '-'}</TableCell>
                    <TableCell>{customer.address || '-'}</TableCell>
                    <TableCell>{customer.vatNumber || '-'}</TableCell>
                    <TableCell>
                      <ActionButtons
                        onEdit={() => handleEditCustomer(customer)}
                        onDelete={() => handleDeleteCustomer(customer.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Customer name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="customer@example.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1-234-567-8900"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address, city, country"
              />
            </div>
            <div>
              <Label htmlFor="vatNumber">VAT Number</Label>
              <Input
                id="vatNumber"
                value={formData.vatNumber}
                onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
                placeholder="VAT number"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveCustomer}>
                {editingCustomer ? 'Update' : 'Add'} Customer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}