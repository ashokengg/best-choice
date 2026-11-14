'use client';

import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useCart } from '../context/CartContext';
import { DELIVERY_FEE, SHOP_NAME, SHOP_UPI_ID } from '../config/shop';
import { TEXT } from '../constants';
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
      cu: TEXT.checkout.upiCurrency,
      tn: TEXT.checkout.upiTransactionNote(SHOP_NAME),
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
          throw new Error(result.error || TEXT.checkout.accountError);
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
        if (active) setAccountError(error instanceof Error ? error.message : TEXT.checkout.accountError);
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
      setCopyMessage(TEXT.checkout.upiCopied);
    } catch (error) {
      console.error('Could not copy the UPI ID.', error);
      setCopyMessage(TEXT.checkout.copyFailed);
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
      setUploadError(TEXT.checkout.invalidImage);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setScreenshot(null);
      setUploadError(TEXT.checkout.imageTooLarge);
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
        setSubmitError(result.error || TEXT.checkout.unableToSubmit);
        return;
      }

      setOrderId(result.orderId);
      clearCart();
    } catch {
      setSubmitError(TEXT.checkout.serverError);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderId) {
    return (
      <main className={styles.mainNarrow}>
        <section className={`${styles.panel} ${styles.centered}`}>
          <div className={styles.successMark} aria-hidden="true">✓</div>
          <h1>{TEXT.checkout.successHeading}</h1>
          <p>{TEXT.checkout.orderId(orderId)}</p>
          <p>{TEXT.checkout.successDetails}</p>
          <p><strong>{TEXT.checkout.paymentPending}</strong></p>
          <p className={styles.warning}>
            {TEXT.checkout.paymentNotVerified}
          </p>
          <Link href="/orders" className={styles.link}>{TEXT.checkout.viewOrderHistory}</Link>
          <div><Link href="/" className={styles.continueLink}>{TEXT.checkout.continueShopping}</Link></div>
        </section>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className={styles.mainNarrow}>
        <section className={styles.panel}>
          <h1>{TEXT.checkout.emptyCart}</h1>
          <Link href="/" className={styles.link}>{TEXT.checkout.browseMenu}</Link>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.mainWide}>
      <section className={styles.panel}>
        <div className={styles.intro}>{TEXT.checkout.demoBanner}</div>
        <h1 className={styles.heading}>{TEXT.checkout.heading}</h1>
        <p className={styles.shopDetails}>
          {TEXT.checkout.shop} <strong>{SHOP_NAME}</strong> · {TEXT.checkout.orderTime} {orderTime || TEXT.checkout.loadingTime}
        </p>
        <p className={styles.warning}>
          {TEXT.checkout.demoWarning} <code>{TEXT.checkout.shopConfigPath}</code> {TEXT.checkout.beforeRealOrders}
        </p>
      </section>

      <div className={styles.checkoutGrid}>
        <section className={styles.panel}>
          <h2>{TEXT.checkout.orderSummary}</h2>
          {cartItems.map((item) => (
            <div key={item.slug} className={styles.orderRow}>
              <span>{item.quantity} × {item.title}<br /><small>{TEXT.checkout.each(Number(item.price))}</small></span>
              <strong>{TEXT.money.symbol}{Number(item.price) * item.quantity}</strong>
            </div>
          ))}
          <p className={styles.summaryLine}><span>{TEXT.checkout.itemsSubtotal}</span><strong>{TEXT.money.symbol}{subtotal}</strong></p>
          <p className={styles.summaryLine}><span>{TEXT.checkout.delivery}</span><strong>{TEXT.money.symbol}{DELIVERY_FEE}</strong></p>
          <p className={styles.totalLine}>
            <strong>{TEXT.checkout.total}</strong><strong>{TEXT.money.symbol}{total}</strong>
          </p>
        </section>

        <section className={`${styles.panel} ${styles.centered}`}>
          <h2>{TEXT.checkout.payUsingUpi}</h2>
          <div className={styles.qrContainer}>
            <QRCodeSVG value={upiUri} size={190} level="M" includeMargin />
          </div>
          <p className={styles.upiLabel}>{TEXT.checkout.upiId}</p>
          <p className={styles.upiId}>{SHOP_UPI_ID}</p>
          <button type="button" onClick={copyUpiId} className={styles.secondaryButton}>{TEXT.checkout.copyUpiId}</button>
          {copyMessage && <p role="status">{copyMessage}</p>}
          <p>
            <a href={upiUri} className={styles.primaryButton}>{TEXT.checkout.payNow}</a>
          </p>
          <p className={styles.safetyNote}>{TEXT.checkout.safetyNote}</p>
        </section>
      </div>

      <form onSubmit={handleSubmit} className={styles.panel}>
        <h2>{TEXT.checkout.screenshotHeading}</h2>
        <p className={styles.warningCompact}>{TEXT.checkout.screenshotRequired}</p>
        {isAuthenticated === false && (
          <p role="alert">{TEXT.checkout.loginBeforeOrder} <Link href="/login" className={styles.link}>{TEXT.common.logIn}</Link></p>
        )}
        {accountError && <p role="alert">{accountError}</p>}
        <div className={styles.fieldGrid}>
          <label className={styles.fieldLabel}>
            {TEXT.checkout.customerName}
            <input required maxLength={100} autoComplete="name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} className={styles.input} />
          </label>
          <label className={styles.fieldLabel}>
            {TEXT.checkout.mobileNumber}
            <input required type="tel" pattern="\+?[0-9]{10,15}" title={TEXT.checkout.mobileValidation} autoComplete="tel" value={mobile} onChange={(event) => setMobile(event.target.value)} className={styles.input} />
          </label>
          <label className={styles.fieldLabel}>
            {TEXT.checkout.transactionId}
            <input required maxLength={100} value={transactionId} onChange={(event) => setTransactionId(event.target.value)} className={styles.input} />
          </label>
        </div>
        <label className={`${styles.fieldLabel} ${styles.fieldLabelSpaced}`}>
          {TEXT.checkout.screenshot}
          <input required type="file" accept="image/*" onChange={(event) => handleScreenshotChange(event.target.files?.[0])} className={`${styles.input} ${styles.fileInput}`} />
        </label>
        <p className={styles.uploadNote}>{TEXT.checkout.uploadNote}</p>
        {uploadError && <p role="alert" className={styles.error}>{uploadError}</p>}
        {submitError && <p role="alert" className={styles.error}>{submitError}</p>}
        {screenshot && (
          <div className={styles.uploaded}>
            <p className={styles.uploadedName}>{TEXT.checkout.screenshotUploaded(screenshot.name)}</p>
            {screenshotUrl && <img src={screenshotUrl} alt={TEXT.checkout.screenshotPreview} className={styles.preview} />}
          </div>
        )}
        <button type="submit" disabled={!screenshot || isSubmitting || isAuthenticated !== true} className={`${styles.primaryButton} ${styles.submitButton}`}>
          {isSubmitting ? TEXT.checkout.submitting : TEXT.checkout.submitOrder}
        </button>
      </form>
    </main>
  );
}
