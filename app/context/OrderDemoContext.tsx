'use client';

import { createContext, useCallback, useContext, useState } from 'react';

export type DemoOrderItem = {
  slug: string;
  title: string;
  price: number;
  quantity: number;
  img?: string;
};

export type PaymentStatus = 'Payment Verification Pending' | 'Payment Verified' | 'Payment Rejected';
export type OrderStatus = 'Order Accepted' | 'Preparing' | 'Ready' | 'Completed' | 'Rejected';

export type DemoOrder = {
  id: string;
  customerName: string;
  mobile: string;
  items: DemoOrderItem[];
  total: number;
  paymentMethod: 'UPI';
  screenshot: File;
  transactionId: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus | 'Payment Verification Pending';
  createdAt: string;
};

type OrderDemoContextValue = {
  orders: DemoOrder[];
  submitDemoOrder: (order: Omit<DemoOrder, 'id' | 'paymentStatus' | 'orderStatus'>) => string;
  updateDemoOrder: (id: string, updates: Partial<Pick<DemoOrder, 'paymentStatus' | 'orderStatus'>>) => void;
};

const OrderDemoContext = createContext<OrderDemoContextValue | undefined>(undefined);

export function OrderDemoProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<DemoOrder[]>([]);

  const submitDemoOrder = useCallback((order: Omit<DemoOrder, 'id' | 'paymentStatus' | 'orderStatus'>) => {
    const id = `ORD${crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase()}`;
    setOrders((current) => [
      {
        ...order,
        id,
        paymentStatus: 'Payment Verification Pending',
        orderStatus: 'Payment Verification Pending',
      },
      ...current,
    ]);
    return id;
  }, []);

  const updateDemoOrder = useCallback(
    (id: string, updates: Partial<Pick<DemoOrder, 'paymentStatus' | 'orderStatus'>>) => {
      setOrders((current) => current.map((order) => order.id === id ? { ...order, ...updates } : order));
    },
    []
  );

  return (
    <OrderDemoContext.Provider value={{ orders, submitDemoOrder, updateDemoOrder }}>
      {children}
    </OrderDemoContext.Provider>
  );
}

export function useOrderDemo() {
  const context = useContext(OrderDemoContext);
  if (!context) throw new Error('useOrderDemo must be used within an OrderDemoProvider');
  return context;
}
