'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { ORDER_STATUSES, TEXT } from '../../constants';
import styles from './page.module.css';

type OrderItem = { slug: string; title: string; price: number; quantity: number };
type PaymentStatus =
  | typeof ORDER_STATUSES.paymentPending
  | typeof ORDER_STATUSES.paymentVerified
  | typeof ORDER_STATUSES.paymentRejected;
type OrderStatus =
  | typeof ORDER_STATUSES.paymentPending
  | typeof ORDER_STATUSES.orderAccepted
  | typeof ORDER_STATUSES.preparing
  | typeof ORDER_STATUSES.ready
  | typeof ORDER_STATUSES.completed
  | typeof ORDER_STATUSES.rejected;
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
    if (!response.ok) throw new Error(result.error || TEXT.api.shopkeeperOrders.loadFailed);
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
        if (!response.ok) throw new Error(result.error || TEXT.api.shopkeeperOrders.loadFailed);
        setOrders(result.orders);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : TEXT.api.shopkeeperOrders.loadFailed);
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
      if (!response.ok) throw new Error(result.error || TEXT.api.orders.updateFailed);
      await loadOrders();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : TEXT.api.orders.updateFailed);
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
      className={styles.actionButton}
    >
      {label}
    </button>
  );

  const orderActions = (order: ShopOrder) => {
    const verified = order.paymentStatus === ORDER_STATUSES.paymentVerified;
    const rejected = order.paymentStatus === ORDER_STATUSES.paymentRejected;
    const accepted = order.orderStatus === ORDER_STATUSES.orderAccepted;
    const preparing = order.orderStatus === ORDER_STATUSES.preparing;
    const ready = order.orderStatus === ORDER_STATUSES.ready;
    const completed = order.orderStatus === ORDER_STATUSES.completed;
    const updating = updatingId === order.id;

    return (
      <div className={styles.actions}>
        {actionButton(TEXT.shopkeeperOrders.verifyPayment, () => updateOrder(order.id, { paymentStatus: ORDER_STATUSES.paymentVerified }), updating || verified || rejected)}
        {actionButton(TEXT.shopkeeperOrders.rejectPayment, () => updateOrder(order.id, { paymentStatus: ORDER_STATUSES.paymentRejected }), updating || verified || rejected)}
        {actionButton(TEXT.shopkeeperOrders.acceptOrder, () => updateOrder(order.id, { orderStatus: ORDER_STATUSES.orderAccepted }), updating || !verified || accepted || preparing || ready || completed || rejected)}
        {actionButton(TEXT.shopkeeperOrders.markPreparing, () => updateOrder(order.id, { orderStatus: ORDER_STATUSES.preparing }), updating || !accepted || preparing || ready || completed)}
        {actionButton(TEXT.shopkeeperOrders.markReady, () => updateOrder(order.id, { orderStatus: ORDER_STATUSES.ready }), updating || !preparing || ready || completed)}
        {actionButton(TEXT.shopkeeperOrders.completeOrder, () => updateOrder(order.id, { orderStatus: ORDER_STATUSES.completed }), updating || !ready || completed)}
      </div>
    );
  };

  return (
    <main className={styles.main}>
      <section className={`${styles.panel} ${styles.introPanel}`}>
        <p className={styles.intro}>{TEXT.shopkeeperOrders.accessRequired}</p>
        <h1>{TEXT.shopkeeperOrders.heading}</h1>
        <p>{TEXT.shopkeeperOrders.description}</p>
        <Link href="/checkout" className={styles.link}>{TEXT.shopkeeperOrders.returnToCheckout}</Link>
      </section>

      {needsLogin && (
        <section className={`${styles.panel} ${styles.secondaryPanel}`}>
          <p>{TEXT.shopkeeperOrders.loginPrompt}</p>
          <Link href="/login?next=%2Fshopkeeper%2Forders" className={styles.link}>{TEXT.common.logInAsShopkeeper}</Link>
        </section>
      )}
      {forbidden && (
        <section className={`${styles.panel} ${styles.secondaryPanel}`}>
          <p role="alert">{TEXT.shopkeeperOrders.noAccess}</p>
        </section>
      )}
      {isLoading && <p>{TEXT.shopkeeperOrders.loading}</p>}
      {error && <p role="alert">{error}</p>}
      {!isLoading && !needsLogin && !forbidden && !error && orders.length === 0 && (
        <section className={`${styles.panel} ${styles.secondaryPanel}`}>
          <h2>{TEXT.shopkeeperOrders.empty}</h2>
        </section>
      )}
      {orders.length > 0 && (
        <div className={styles.orders}>
          {orders.map((order) => (
            <article key={order.id} className={styles.order}>
              <h2>#{order.id}</h2>
              <p><strong>{TEXT.shopkeeperOrders.customer}</strong> {order.customerName} · {order.mobile}</p>
              <p><strong>{TEXT.common.items}</strong></p>
              <ul>
                {order.items.map((item) => (
                  <li key={item.slug}>{item.quantity} × {item.title} — {TEXT.money.symbol}{item.price * item.quantity}</li>
                ))}
              </ul>
              <p><strong>{TEXT.common.total}</strong> {TEXT.money.symbol}{order.total} · <strong>{TEXT.common.payment}</strong> {TEXT.checkout.paymentMethod}</p>
              <p><strong>{TEXT.shopkeeperOrders.paymentStatus}</strong> {order.paymentStatus}</p>
              <p><strong>{TEXT.shopkeeperOrders.orderStatus}</strong> {order.orderStatus}</p>
              <p><strong>{TEXT.shopkeeperOrders.dateTime}</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>{TEXT.shopkeeperOrders.reference}</strong> {order.transactionId}</p>
              <p><strong>{TEXT.shopkeeperOrders.screenshot}</strong> <a href={`/api/shopkeeper/orders/${order.id}/screenshot`} target="_blank" rel="noreferrer" className={styles.link}>{TEXT.shopkeeperOrders.viewScreenshot}</a></p>
              {orderActions(order)}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
