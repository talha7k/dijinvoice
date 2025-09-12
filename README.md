# DijiInvoice

A multi-tenant SaaS platform for invoice management built with Next.js, Shadcn/ui, and Firebase.

## Features

- **Multi-tenant SaaS**: Isolated data per organization
- **Quotes Management**: Create quotes and convert to invoices
- **Invoice Tracking**: Manage invoices with partial payments
- **Products & Services**: Catalog management
- **Offline Support**: PWA with offline capabilities
- **Firebase Integration**: Auth, Firestore, Storage

## Setup

1. **Firebase Project**:
   - Create a new Firebase project at https://console.firebase.google.com/
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Enable Storage (optional)

2. **Environment Variables**:
   - Copy `.env.local` and fill in your Firebase config:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

## Project Structure

- `src/app/` - Next.js app router pages
- `src/components/` - Reusable UI components
- `src/contexts/` - React contexts (Auth)
- `src/lib/` - Utilities, Firebase config, types
- `public/` - Static assets

## Database Schema

Data is stored in Firestore with tenant isolation:

```
/tenants/{tenantId}/
  - quotes/
  - invoices/
  - products/
  - services/
  - payments/
```

## Authentication

- Sign up creates a new tenant
- Users are scoped to their tenant
- Firebase Auth handles authentication

## Offline Support

- Firestore automatically syncs when online
- PWA manifest for installable app
- Service worker for caching (to be implemented)

## Next Steps

- Implement invoices UI
- Add payments tracking
- Build products/services management
- Add more auth features (password reset, etc.)
- Implement proper service worker for offline
