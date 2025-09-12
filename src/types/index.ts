export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  rate: number; // hourly rate
  category?: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
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
  notes?: string;
  validUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  tenantId: string;
  quoteId?: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  clientVAT?: string;
  items: QuoteItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: Date;
  notes?: string;
  template: 'english' | 'arabic';
  includeQR: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  tenantId: string;
  invoiceId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
  reference?: string;
  notes?: string;
  createdAt: Date;
}

export interface TemplateField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'date';
  label: string;
  defaultValue?: string | number | boolean;
  options?: string[]; // for select type
  required: boolean;
  visible: boolean;
}

export interface TemplateStyle {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: number;
  logoUrl?: string;
  showLogo: boolean;
  showWatermark: boolean;
  watermarkText?: string;
}

export interface InvoiceTemplate {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  type: 'english' | 'arabic' | 'custom';
  isDefault: boolean;
  fields: TemplateField[];
  style: TemplateStyle;
  customCSS?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  address?: string;
  phone?: string;
  vatNumber?: string;
  createdAt: Date;
  subscriptionStatus: 'active' | 'inactive' | 'trial';
}