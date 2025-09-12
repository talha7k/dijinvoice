export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  tenantId: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  rate: number; // hourly rate
  category?: string;
  tenantId: string;
}

export interface QuoteItem {
  id: string;
  type: 'product' | 'service';
  productId?: string;
  serviceId?: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quote {
  id: string;
  tenantId: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  items: QuoteItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'converted';
  createdAt: Date;
  updatedAt: Date;
  validUntil?: Date;
  notes?: string;
}

export interface Invoice {
  id: string;
  tenantId: string;
  quoteId?: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  items: QuoteItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
  notes?: string;
  payments: Payment[];
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
  notes?: string;
  tenantId: string;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  subscriptionStatus: 'active' | 'inactive' | 'trial';
}