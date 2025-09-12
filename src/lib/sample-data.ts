// Sample data for customers, products, and services
// This would typically come from a database

export interface Customer {
  id: string
  name: string
  email: string
  address?: string
  phone?: string
}

export interface ProductService {
  id: string
  name: string
  description?: string
  price: number
  type: 'product' | 'service'
  category?: string
}

// Sample customers
export const sampleCustomers: Customer[] = [
  {
    id: '1',
    name: 'ABC Corporation',
    email: 'contact@abc.com',
    address: '123 Business St, City, Country',
    phone: '+1-234-567-8900'
  },
  {
    id: '2',
    name: 'XYZ Industries',
    email: 'info@xyz.com',
    address: '456 Industrial Ave, City, Country',
    phone: '+1-234-567-8901'
  },
  {
    id: '3',
    name: 'Tech Solutions Ltd',
    email: 'hello@techsolutions.com',
    address: '789 Tech Park, City, Country',
    phone: '+1-234-567-8902'
  },
  {
    id: '4',
    name: 'Global Services Inc',
    email: 'support@globalservices.com',
    address: '321 Service Rd, City, Country',
    phone: '+1-234-567-8903'
  },
  {
    id: '5',
    name: 'Local Business Co',
    email: 'admin@localbusiness.com',
    address: '654 Main St, City, Country',
    phone: '+1-234-567-8904'
  }
]

// Sample products and services
export const sampleProductsServices: ProductService[] = [
  // Products
  {
    id: 'p1',
    name: 'Laptop Computer',
    description: 'High-performance laptop for business use',
    price: 1200.00,
    type: 'product',
    category: 'Electronics'
  },
  {
    id: 'p2',
    name: 'Office Chair',
    description: 'Ergonomic office chair with lumbar support',
    price: 350.00,
    type: 'product',
    category: 'Furniture'
  },
  {
    id: 'p3',
    name: 'Wireless Mouse',
    description: 'Bluetooth wireless mouse with ergonomic design',
    price: 45.00,
    type: 'product',
    category: 'Electronics'
  },
  {
    id: 'p4',
    name: 'Printer Paper (500 sheets)',
    description: 'A4 size printer paper, 80gsm',
    price: 12.50,
    type: 'product',
    category: 'Office Supplies'
  },
  {
    id: 'p5',
    name: 'External Hard Drive',
    description: '2TB external hard drive for data backup',
    price: 89.99,
    type: 'product',
    category: 'Electronics'
  },

  // Services
  {
    id: 's1',
    name: 'Web Development',
    description: 'Custom website development service',
    price: 150.00,
    type: 'service',
    category: 'Development'
  },
  {
    id: 's2',
    name: 'Graphic Design',
    description: 'Logo and branding design service',
    price: 120.00,
    type: 'service',
    category: 'Design'
  },
  {
    id: 's3',
    name: 'IT Support',
    description: 'Technical support and maintenance',
    price: 85.00,
    type: 'service',
    category: 'IT Services'
  },
  {
    id: 's4',
    name: 'Consulting',
    description: 'Business consulting services',
    price: 200.00,
    type: 'service',
    category: 'Consulting'
  },
  {
    id: 's5',
    name: 'SEO Optimization',
    description: 'Search engine optimization service',
    price: 175.00,
    type: 'service',
    category: 'Marketing'
  }
]

// Helper functions to get combobox options
export const getCustomerOptions = (customers: Customer[]) => {
  return customers.map(customer => ({
    value: customer.id,
    label: customer.name,
    description: customer.email
  }))
}

export const getProductServiceOptions = (items: ProductService[]) => {
  return items.map(item => ({
    value: item.id,
    label: item.name,
    description: `${item.type === 'product' ? 'Product' : 'Service'} - $${item.price.toFixed(2)}`
  }))
}

export const getCustomerById = (customers: Customer[], id: string) => {
  return customers.find(customer => customer.id === id)
}

export const getProductServiceById = (items: ProductService[], id: string) => {
  return items.find(item => item.id === id)
}