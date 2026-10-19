'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

type OrderItem = { slug: string; title: string; price: number; quantity: number };
type PaymentStatus = 'Payment Verification Pending' | 'Payment Verified' | 'Payment Rejected';
type OrderStatus = 'Payment Verification Pending' | 'Order Accepted' | 'Preparing' | 'Ready' | 'Completed' | 'Rejected';
type ShopOrder = {
  id: string;
  customerName: string;
  mobile: string;
  items: OrderItem[];
  total: number;
  transactionId: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
};

export default function ShopkeeperOrdersPage() {
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');
  const [needsLogin, setNeedsLogin] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState('');

  const loadOrders = useCallback(async () => {
    const response = await fetch('/api/shopkeeper/orders');
    const result = await response.json();
    if (response.status === 401) {
      setNeedsLogin(true);
      return;
    }
    if (response.status === 403) {
      setForbidden(true);
      return;
    }
    if (!response.ok) throw new Error(result.error || 'Unable to load orders.');
    setOrders(result.orders);
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/shopkeeper/orders')
      .then(async (response) => {
        const result = await response.json();
        if (!active) return;
        if (response.status === 401) {
          setNeedsLogin(true);
          return;
        }
        if (response.status === 403) {
          setForbidden(true);
          return;
        }
        if (!response.ok) throw new Error(result.error || 'Unable to load orders.');
        setOrders(result.orders);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Unable to load orders.');
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  const updateOrder = async (orderId: string, update: { paymentStatus?: PaymentStatus; orderStatus?: OrderStatus }) => {
    setUpdatingId(orderId);
    setError('');
    try {
      const response = await fetch('/api/shopkeeper/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, ...update }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to update order.');
      await loadOrders();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Unable to update order.');
    } finally {
      setUpdatingId('');
    }
  };

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

  const orderActions = (order: ShopOrder) => {
    const verified = order.paymentStatus === 'Payment Verified';
    const rejected = order.paymentStatus === 'Payment Rejected';
    const accepted = order.orderStatus === 'Order Accepted';
    const preparing = order.orderStatus === 'Preparing';
    const ready = order.orderStatus === 'Ready';
    const completed = order.orderStatus === 'Completed';
    const updating = updatingId === order.id;

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
        {actionButton('Verify Payment', () => updateOrder(order.id, { paymentStatus: 'Payment Verified' }), updating || verified || rejected)}
        {actionButton('Reject Payment', () => updateOrder(order.id, { paymentStatus: 'Payment Rejected' }), updating || verified || rejected)}
        {actionButton('Accept Order', () => updateOrder(order.id, { orderStatus: 'Order Accepted' }), updating || !verified || accepted || preparing || ready || completed || rejected)}
        {actionButton('Mark Preparing', () => updateOrder(order.id, { orderStatus: 'Preparing' }), updating || !accepted || preparing || ready || completed)}
        {actionButton('Mark Ready', () => updateOrder(order.id, { orderStatus: 'Ready' }), updating || !preparing || ready || completed)}
        {actionButton('Complete Order', () => updateOrder(order.id, { orderStatus: 'Completed' }), updating || !ready || completed)}
      </div>
    );
  };

  return (
    <main style={{ maxWidth: 1100, margin: '28px auto', padding: 16, color: 'white' }}>
      <section style={{ background: 'rgba(10,31,65,.94)', borderRadius: 18, padding: 24, border: '1px solid rgba(255,255,255,.2)' }}>
        <p style={{ color: '#ffe082', fontWeight: 700 }}>SHOPKEEPER ACCESS REQUIRED</p>
        <h1>Shopkeeper Orders</h1>
        <p>Only accounts with the shopkeeper role can view customer orders or payment screenshots.</p>
        <Link href="/checkout" style={{ color: '#90caf9' }}>Return to checkout</Link>
      </section>

      {needsLogin && (
        <section style={{ marginTop: 20, background: 'rgba(10,31,65,.94)', borderRadius: 18, padding: 24 }}>
          <p>Please log in with a shopkeeper account to continue.</p>
          <Link href="/login?next=%2Fshopkeeper%2Forders" style={{ color: '#90caf9' }}>Log in as shopkeeper</Link>
        </section>
      )}
      {forbidden && (
        <section style={{ marginTop: 20, background: 'rgba(10,31,65,.94)', borderRadius: 18, padding: 24 }}>
          <p role="alert">This account does not have shopkeeper access. Ask an administrator to assign the shopkeeper role.</p>
        </section>
      )}
      {isLoading && <p>Loading orders…</p>}
      {error && <p role="alert">{error}</p>}
      {!isLoading && !needsLogin && !forbidden && !error && orders.length === 0 && (
        <section style={{ marginTop: 20, background: 'rgba(10,31,65,.94)', borderRadius: 18, padding: 24 }}>
          <h2>No orders yet</h2>
        </section>
      )}
      {orders.length > 0 && (
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
              <p><strong>Total:</strong> ₹{order.total} · <strong>Payment:</strong> UPI</p>
              <p><strong>Payment status:</strong> {order.paymentStatus}</p>
              <p><strong>Order status:</strong> {order.orderStatus}</p>
              <p><strong>Date/time:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Reference ID:</strong> {order.transactionId}</p>
              <p><strong>Payment screenshot:</strong> <a href={`/api/shopkeeper/orders/${order.id}/screenshot`} target="_blank" rel="noreferrer" style={{ color: '#90caf9' }}>View screenshot</a></p>
              {orderActions(order)}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
