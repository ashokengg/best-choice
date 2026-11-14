'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { TEXT } from '../constants';
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
        if (!response.ok) throw new Error(result.error || TEXT.orders.loadError);
        if (active) setOrders(result.orders);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : TEXT.orders.loadError);
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <main className={styles.main}>
      <section className={styles.panel}>
        <h1>{TEXT.orders.heading}</h1>
        {isLoading && <p>{TEXT.orders.loading}</p>}
        {needsLogin && <p>{TEXT.orders.loginPrompt} <Link href="/login" className={styles.loginLink}>{TEXT.common.logIn}</Link> {TEXT.orders.loginSuffix}</p>}
        {error && <p role="alert">{error}</p>}
        {!isLoading && !needsLogin && !error && orders.length === 0 && <p>{TEXT.orders.empty}</p>}
        <div className={styles.orders}>
          {orders.map((order) => (
            <article key={order.id} className={styles.order}>
              <h2>{TEXT.common.order} #{order.id}</h2>
              <p>{new Date(order.createdAt).toLocaleString()}</p>
              <ul>
                {order.items.map((item) => (
                  <li key={item.slug}>{item.quantity} × {item.title} — {TEXT.money.symbol}{item.price * item.quantity}</li>
                ))}
              </ul>
              <p><strong>{TEXT.orders.total}</strong> {TEXT.money.symbol}{order.total}</p>
              <p><strong>{TEXT.orders.payment}</strong> {order.paymentStatus} · <strong>{TEXT.orders.order}</strong> {order.orderStatus}</p>
              <p><strong>{TEXT.orders.reference}</strong> {order.transactionId}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
