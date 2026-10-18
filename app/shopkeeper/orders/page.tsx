'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SHOPKEEPER_MOBILE } from '../../config/shop';
import { useOrderDemo, type DemoOrder } from '../../context/OrderDemoContext';

function ScreenshotLink({ file }: { file: File }) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    const nextUrl = URL.createObjectURL(file);
    setUrl(nextUrl);
    return () => URL.revokeObjectURL(nextUrl);
  }, [file]);

  return url ? (
    <a href={url} target="_blank" rel="noreferrer" style={{ color: '#90caf9' }}>
      View screenshot
    </a>
  ) : <span>Loading screenshot…</span>;
}

export default function ShopkeeperOrdersPage() {
  const { orders, updateDemoOrder } = useOrderDemo();

  const actionButton = (label: string, action: () => void, disabled = false) => (
    <button
      key={label}
      type="button"
      disabled={disabled}
      onClick={action}
      style={{
        border: 0,
        borderRadius: 7,
        padding: '8px 11px',
        background: disabled ? '#65758a' : '#1976d2',
        color: 'white',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {label}
    </button>
  );

  const orderActions = (order: DemoOrder) => {
    const verified = order.paymentStatus === 'Payment Verified';
    const rejected = order.paymentStatus === 'Payment Rejected';
    const accepted = order.orderStatus === 'Order Accepted';
    const preparing = order.orderStatus === 'Preparing';
    const ready = order.orderStatus === 'Ready';
    const completed = order.orderStatus === 'Completed';

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
        {actionButton('Verify Payment', () => updateDemoOrder(order.id, { paymentStatus: 'Payment Verified' }), verified || rejected)}
        {actionButton('Reject Payment', () => updateDemoOrder(order.id, { paymentStatus: 'Payment Rejected', orderStatus: 'Rejected' }), verified || rejected)}
        {actionButton('Accept Order', () => updateDemoOrder(order.id, { orderStatus: 'Order Accepted' }), !verified || accepted || preparing || ready || completed || rejected)}
        {actionButton('Mark Preparing', () => updateDemoOrder(order.id, { orderStatus: 'Preparing' }), !accepted || preparing || ready || completed)}
        {actionButton('Mark Ready', () => updateDemoOrder(order.id, { orderStatus: 'Ready' }), !preparing || ready || completed)}
        {actionButton('Complete Order', () => updateDemoOrder(order.id, { orderStatus: 'Completed' }), !ready || completed)}
      </div>
    );
  };

  return (
    <main style={{ maxWidth: 1100, margin: '28px auto', padding: 16, color: 'white' }}>
      <section style={{ background: 'rgba(10,31,65,.94)', borderRadius: 18, padding: 24, border: '1px solid rgba(255,255,255,.2)' }}>
        <p style={{ color: '#ffe082', fontWeight: 700 }}>DEMO DASHBOARD · NOT AUTHENTICATED</p>
        <h1>Shopkeeper Orders</h1>
        <p>Notification destination: {SHOPKEEPER_MOBILE || 'Not configured'}. Notifications are not sent in this UI demo.</p>
        <p>Demo orders and screenshots are held only in app memory. They are not securely persisted or private.</p>
        <Link href="/checkout" style={{ color: '#90caf9' }}>Return to checkout</Link>
      </section>

      {orders.length === 0 ? (
        <section style={{ marginTop: 20, background: 'rgba(10,31,65,.94)', borderRadius: 18, padding: 24 }}>
          <h2>No demo orders yet</h2>
          <p>Submit an order with a screenshot from checkout to see it here during this app session.</p>
        </section>
      ) : (
        <div style={{ display: 'grid', gap: 18, marginTop: 20 }}>
          {orders.map((order) => (
            <article key={order.id} style={{ background: 'rgba(10,31,65,.94)', borderRadius: 18, padding: 22, border: '1px solid rgba(255,255,255,.2)' }}>
              <h2>#{order.id}</h2>
              <p><strong>Customer:</strong> {order.customerName} · {order.mobile}</p>
              <p><strong>Items:</strong></p>
              <ul>
                {order.items.map((item) => (
                  <li key={item.slug}>{item.quantity} × {item.title} — ₹{item.price * item.quantity}</li>
                ))}
              </ul>
              <p><strong>Total:</strong> ₹{order.total} · <strong>Payment:</strong> {order.paymentMethod}</p>
              <p><strong>Payment status:</strong> {order.paymentStatus}</p>
              <p><strong>Order status:</strong> {order.orderStatus}</p>
              <p><strong>Date/time:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Reference ID:</strong> {order.transactionId || 'Not provided'}</p>
              <p><strong>Payment screenshot:</strong> <ScreenshotLink file={order.screenshot} /></p>
              {orderActions(order)}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
