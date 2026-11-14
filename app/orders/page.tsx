'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

type OrderItem = { slug: string; title: string; price: number; quantity: number };
type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  transactionId: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/orders')
      .then(async (response) => {
        const result = await response.json();
        if (response.status === 401) {
          if (active) setNeedsLogin(true);
          return;
        }
        if (!response.ok) throw new Error(result.error || 'Could not load order history.');
        if (active) setOrders(result.orders);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Could not load order history.');
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <main className={styles.main}>
      <section className={styles.panel}>
        <h1>My Order History</h1>
        {isLoading && <p>Loading your orders…</p>}
        {needsLogin && <p>Please <Link href="/login" className={styles.loginLink}>log in</Link> to see your orders.</p>}
        {error && <p role="alert">{error}</p>}
        {!isLoading && !needsLogin && !error && orders.length === 0 && <p>You have not placed any orders yet.</p>}
        <div className={styles.orders}>
          {orders.map((order) => (
            <article key={order.id} className={styles.order}>
              <h2>Order #{order.id}</h2>
              <p>{new Date(order.createdAt).toLocaleString()}</p>
              <ul>
                {order.items.map((item) => (
                  <li key={item.slug}>{item.quantity} × {item.title} — ₹{item.price * item.quantity}</li>
                ))}
              </ul>
              <p><strong>Total:</strong> ₹{order.total}</p>
              <p><strong>Payment:</strong> {order.paymentStatus} · <strong>Order:</strong> {order.orderStatus}</p>
              <p><strong>Transaction/reference ID:</strong> {order.transactionId}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
