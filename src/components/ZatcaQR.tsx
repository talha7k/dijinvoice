'use client';

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Invoice, Tenant } from '@/types';

interface ZatcaQRProps {
  invoice: Invoice;
  tenant: Tenant;
}

export default function ZatcaQR({ invoice, tenant }: ZatcaQRProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // ZATCA QR code format (simplified)
    // TLV format: Tag, Length, Value
    const sellerName = tenant.name;
    const vatNumber = tenant.vatNumber || '';
    const invoiceDate = invoice.createdAt.toISOString().split('T')[0];
    const total = invoice.total.toFixed(2);
    const vatAmount = invoice.taxAmount.toFixed(2);

    // Create TLV data (simplified for demo)
    const tlvData = [
      { tag: 1, value: sellerName },
      { tag: 2, value: vatNumber },
      { tag: 3, value: invoiceDate },
      { tag: 4, value: total },
      { tag: 5, value: vatAmount },
    ];

    // Convert to base64 (simplified)
    const qrString = JSON.stringify({
      sellerName,
      vatNumber,
      invoiceDate,
      total,
      vatAmount,
    });

    QRCode.toCanvas(canvasRef.current, qrString, {
      width: 150,
      margin: 1,
    });
  }, [invoice, tenant]);

  return <canvas ref={canvasRef} />;
}