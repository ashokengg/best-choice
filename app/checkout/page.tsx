'use client';

import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useCart } from '../context/CartContext';
import { DELIVERY_FEE, SHOP_NAME, SHOP_UPI_ID } from '../config/shop';
import styles from './page.module.css';

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [orderId, setOrderId] = useState('');
  const [orderTime, setOrderTime] = useState('');
  const [copyMessage, setCopyMessage] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [accountError, setAccountError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const total = subtotal + DELIVERY_FEE;
  const upiUri = useMemo(() => {
    const params = new URLSearchParams({
      pa: SHOP_UPI_ID,
      pn: SHOP_NAME,
      am: total.toFixed(2),
      cu: 'INR',
      tn: `Order payment at ${SHOP_NAME}`,
    });
    return `upi://pay?${params.toString()}`;
  }, [total]);

  useEffect(() => {
    setOrderTime(new Date().toLocaleString());
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/auth/me')
      .then(async (response) => {
        if (response.status === 401) {
          if (active) setIsAuthenticated(false);
          return;
        }
        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || 'Could not check your account.');
        }
        const result = await response.json();
        if (active) {
          setIsAuthenticated(true);
          setCustomerName(result.user.name);
          setMobile(result.user.phone);
        }
      })
      .catch((error: unknown) => {
        console.error('Could not check signed-in account.', error);
        if (active) setAccountError(error instanceof Error ? error.message : 'Could not check your account.');
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!screenshot) {
      setScreenshotUrl('');
      return;
    }

    const url = URL.createObjectURL(screenshot);
    setScreenshotUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [screenshot]);

  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(SHOP_UPI_ID);
      setCopyMessage('UPI ID copied.');
    } catch (error) {
      console.error('Could not copy the UPI ID.', error);
      setCopyMessage('Copy failed. Please select and copy the UPI ID.');
    }
  };

  const handleScreenshotChange = (file: File | undefined) => {
    setUploadError('');
    if (!file) {
      setScreenshot(null);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setScreenshot(null);
      setUploadError('Choose an image file for the payment screenshot.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setScreenshot(null);
      setUploadError('The screenshot must be 5 MB or smaller.');
      return;
    }
    setScreenshot(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!screenshot || cartItems.length === 0) return;
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.set('customerName', customerName.trim());
      form.set('mobile', mobile);
      form.set('transactionId', transactionId.trim());
      form.set('items', JSON.stringify(cartItems.map(({ slug, quantity }) => ({ slug, quantity }))));
      form.set('screenshot', screenshot);

      const response = await fetch('/api/orders', { method: 'POST', body: form });
      const result = await response.json();
      if (!response.ok) {
        setSubmitError(result.error || 'Unable to submit your order.');
        return;
      }

      setOrderId(result.orderId);
      clearCart();
    } catch {
      setSubmitError('Could not reach the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderId) {
    return (
      <main className={styles.mainNarrow}>
        <section className={`${styles.panel} ${styles.centered}`}>
          <div className={styles.successMark} aria-hidden="true">✓</div>
          <h1>Order Submitted Successfully!</h1>
          <p>Your order ID is <strong>#{orderId}</strong>.</p>
          <p>The shopkeeper will verify your payment and process your order. Your order is saved in your account.</p>
          <p><strong>Payment Verification Pending</strong></p>
          <p className={styles.warning}>
            Payment has not been verified automatically. Keep your order ID for reference.
          </p>
          <Link href="/orders" className={styles.link}>View your order history</Link>
          <div><Link href="/" className={styles.continueLink}>Continue shopping</Link></div>
        </section>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className={styles.mainNarrow}>
        <section className={styles.panel}>
          <h1>Your cart is empty</h1>
          <Link href="/" className={styles.link}>Browse the menu</Link>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.mainWide}>
      <section className={styles.panel}>
        <div className={styles.intro}>DEMO CHECKOUT · NOT A LIVE PAYMENT</div>
        <h1 className={styles.heading}>Checkout & UPI Payment</h1>
        <p className={styles.shopDetails}>
          Shop: <strong>{SHOP_NAME}</strong> · Order time: {orderTime || 'Loading…'}
        </p>
        <p className={styles.warning}>
          Demo UPI details are shown. Replace the sample UPI ID in <code>app/config/shop.ts</code> before using this for real orders.
        </p>
      </section>

      <div className={styles.checkoutGrid}>
        <section className={styles.panel}>
          <h2>Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.slug} className={styles.orderRow}>
              <span>{item.quantity} × {item.title}<br /><small>₹{Number(item.price)} each</small></span>
              <strong>₹{Number(item.price) * item.quantity}</strong>
            </div>
          ))}
          <p className={styles.summaryLine}><span>Items subtotal</span><strong>₹{subtotal}</strong></p>
          <p className={styles.summaryLine}><span>Delivery</span><strong>₹{DELIVERY_FEE}</strong></p>
          <p className={styles.totalLine}>
            <strong>Total</strong><strong>₹{total}</strong>
          </p>
        </section>

        <section className={`${styles.panel} ${styles.centered}`}>
          <h2>Pay using UPI</h2>
          <div className={styles.qrContainer}>
            <QRCodeSVG value={upiUri} size={190} level="M" includeMargin />
          </div>
          <p className={styles.upiLabel}>UPI ID</p>
          <p className={styles.upiId}>{SHOP_UPI_ID}</p>
          <button type="button" onClick={copyUpiId} className={styles.secondaryButton}>Copy UPI ID</button>
          {copyMessage && <p role="status">{copyMessage}</p>}
          <p>
            <a href={upiUri} className={styles.primaryButton}>Pay Now</a>
          </p>
          <p className={styles.safetyNote}>Scan with a UPI app, or open your UPI app to pay. Never share your UPI PIN.</p>
        </section>
      </div>

      <form onSubmit={handleSubmit} className={styles.panel}>
        <h2>Upload Payment Screenshot</h2>
        <p className={styles.warningCompact}>Payment Pending · Screenshot is required before order submission.</p>
        {isAuthenticated === false && (
          <p role="alert">Log in before submitting an order. <Link href="/login" className={styles.link}>Log in</Link></p>
        )}
        {accountError && <p role="alert">{accountError}</p>}
        <div className={styles.fieldGrid}>
          <label className={styles.fieldLabel}>
            Customer name *
            <input required maxLength={100} autoComplete="name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} className={styles.input} />
          </label>
          <label className={styles.fieldLabel}>
            Mobile number *
            <input required type="tel" pattern="\+?[0-9]{10,15}" title="Enter 10 to 15 digits, optionally starting with +" autoComplete="tel" value={mobile} onChange={(event) => setMobile(event.target.value)} className={styles.input} />
          </label>
          <label className={styles.fieldLabel}>
            Transaction/reference ID *
            <input required maxLength={100} value={transactionId} onChange={(event) => setTransactionId(event.target.value)} className={styles.input} />
          </label>
        </div>
        <label className={`${styles.fieldLabel} ${styles.fieldLabelSpaced}`}>
          Payment screenshot *
          <input required type="file" accept="image/*" onChange={(event) => handleScreenshotChange(event.target.files?.[0])} className={`${styles.input} ${styles.fileInput}`} />
        </label>
        <p className={styles.uploadNote}>JPEG, PNG, or WebP images up to 5 MB are stored with your order for payment verification.</p>
        {uploadError && <p role="alert" className={styles.error}>{uploadError}</p>}
        {submitError && <p role="alert" className={styles.error}>{submitError}</p>}
        {screenshot && (
          <div className={styles.uploaded}>
            <p className={styles.uploadedName}>Screenshot Uploaded: {screenshot.name}</p>
            {screenshotUrl && <img src={screenshotUrl} alt="Payment screenshot preview" className={styles.preview} />}
          </div>
        )}
        <button type="submit" disabled={!screenshot || isSubmitting || isAuthenticated !== true} className={`${styles.primaryButton} ${styles.submitButton}`}>
          {isSubmitting ? 'Submitting order...' : 'Submit Order'}
        </button>
      </form>
    </main>
  );
}
