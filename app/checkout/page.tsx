'use client';

import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useCart } from '../context/CartContext';
import { DELIVERY_FEE, SHOP_NAME, SHOP_UPI_ID } from '../config/shop';

const panelStyle: React.CSSProperties = {
  background: 'rgba(10, 31, 65, 0.93)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 18,
  padding: 24,
  color: 'white',
  boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
};

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
      <main style={{ maxWidth: 760, margin: '36px auto', padding: 20 }}>
        <section style={{ ...panelStyle, textAlign: 'center' }}>
          <div style={{ fontSize: 48 }} aria-hidden="true">✓</div>
          <h1>Order Submitted Successfully!</h1>
          <p>Your order ID is <strong>#{orderId}</strong>.</p>
          <p>The shopkeeper will verify your payment and process your order. Your order is saved in your account.</p>
          <p><strong>Payment Verification Pending</strong></p>
          <p style={{ color: '#ffe082', fontSize: 14 }}>
            Payment has not been verified automatically. Keep your order ID for reference.
          </p>
          <Link href="/orders" style={{ color: '#90caf9' }}>View your order history</Link>
          <div><Link href="/" style={{ display: 'inline-block', marginTop: 20, color: '#90caf9' }}>Continue shopping</Link></div>
        </section>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main style={{ maxWidth: 760, margin: '36px auto', padding: 20 }}>
        <section style={panelStyle}>
          <h1>Your cart is empty</h1>
          <Link href="/" style={{ color: '#90caf9' }}>Browse the menu</Link>
        </section>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 980, margin: '28px auto', padding: 16, display: 'grid', gap: 20 }}>
      <section style={panelStyle}>
        <div style={{ color: '#ffe082', fontSize: 13, fontWeight: 700 }}>DEMO CHECKOUT · NOT A LIVE PAYMENT</div>
        <h1 style={{ marginBottom: 8 }}>Checkout & UPI Payment</h1>
        <p style={{ marginTop: 0, opacity: 0.85 }}>
          Shop: <strong>{SHOP_NAME}</strong> · Order time: {orderTime || 'Loading…'}
        </p>
        <p style={{ color: '#ffe082', fontSize: 14 }}>
          Demo UPI details are shown. Replace the sample UPI ID in <code>app/config/shop.ts</code> before using this for real orders.
        </p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 20 }}>
        <section style={panelStyle}>
          <h2>Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.slug} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.18)' }}>
              <span>{item.quantity} × {item.title}<br /><small>₹{Number(item.price)} each</small></span>
              <strong>₹{Number(item.price) * item.quantity}</strong>
            </div>
          ))}
          <p style={{ display: 'flex', justifyContent: 'space-between' }}><span>Items subtotal</span><strong>₹{subtotal}</strong></p>
          <p style={{ display: 'flex', justifyContent: 'space-between' }}><span>Delivery</span><strong>₹{DELIVERY_FEE}</strong></p>
          <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, borderTop: '1px solid rgba(255,255,255,0.35)', paddingTop: 12 }}>
            <strong>Total</strong><strong>₹{total}</strong>
          </p>
        </section>

        <section style={{ ...panelStyle, textAlign: 'center' }}>
          <h2>Pay using UPI</h2>
          <div style={{ display: 'inline-block', background: 'white', padding: 12, borderRadius: 12 }}>
            <QRCodeSVG value={upiUri} size={190} level="M" includeMargin />
          </div>
          <p style={{ marginBottom: 6 }}>UPI ID</p>
          <p style={{ fontSize: 20, fontWeight: 700, marginTop: 0, overflowWrap: 'anywhere' }}>{SHOP_UPI_ID}</p>
          <button type="button" onClick={copyUpiId} style={secondaryButtonStyle}>Copy UPI ID</button>
          {copyMessage && <p role="status">{copyMessage}</p>}
          <p>
            <a href={upiUri} style={primaryButtonStyle}>Pay Now</a>
          </p>
          <p style={{ fontSize: 13, opacity: 0.8 }}>Scan with a UPI app, or open your UPI app to pay. Never share your UPI PIN.</p>
        </section>
      </div>

      <form onSubmit={handleSubmit} style={panelStyle}>
        <h2>Upload Payment Screenshot</h2>
        <p style={{ color: '#ffe082' }}>Payment Pending · Screenshot is required before order submission.</p>
        {isAuthenticated === false && (
          <p role="alert">Log in before submitting an order. <Link href="/login" style={{ color: '#90caf9' }}>Log in</Link></p>
        )}
        {accountError && <p role="alert">{accountError}</p>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 14 }}>
          <label style={fieldLabelStyle}>
            Customer name *
            <input required maxLength={100} autoComplete="name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} style={inputStyle} />
          </label>
          <label style={fieldLabelStyle}>
            Mobile number *
            <input required type="tel" pattern="\+?[0-9]{10,15}" title="Enter 10 to 15 digits, optionally starting with +" autoComplete="tel" value={mobile} onChange={(event) => setMobile(event.target.value)} style={inputStyle} />
          </label>
          <label style={fieldLabelStyle}>
            Transaction/reference ID *
            <input required maxLength={100} value={transactionId} onChange={(event) => setTransactionId(event.target.value)} style={inputStyle} />
          </label>
        </div>
        <label style={{ ...fieldLabelStyle, marginTop: 16 }}>
          Payment screenshot *
          <input required type="file" accept="image/*" onChange={(event) => handleScreenshotChange(event.target.files?.[0])} style={{ ...inputStyle, padding: 10 }} />
        </label>
        <p style={{ fontSize: 13, opacity: 0.8 }}>JPEG, PNG, or WebP images up to 5 MB are stored with your order for payment verification.</p>
        {uploadError && <p role="alert" style={{ color: '#ffcdd2' }}>{uploadError}</p>}
        {submitError && <p role="alert" style={{ color: '#ffcdd2' }}>{submitError}</p>}
        {screenshot && (
          <div style={{ marginTop: 12 }}>
            <p style={{ color: '#a5d6a7' }}>Screenshot Uploaded: {screenshot.name}</p>
            {screenshotUrl && <img src={screenshotUrl} alt="Payment screenshot preview" style={{ maxWidth: 220, maxHeight: 220, objectFit: 'contain', borderRadius: 8, background: 'white' }} />}
          </div>
        )}
        <button type="submit" disabled={!screenshot || isSubmitting || isAuthenticated !== true} style={{ ...primaryButtonStyle, opacity: screenshot && isAuthenticated && !isSubmitting ? 1 : 0.55, cursor: screenshot && isAuthenticated && !isSubmitting ? 'pointer' : 'not-allowed', marginTop: 18 }}>
          {isSubmitting ? 'Submitting order...' : 'Submit Order'}
        </button>
      </form>
    </main>
  );
}

const fieldLabelStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 7, fontWeight: 600 };
const inputStyle: React.CSSProperties = { width: '100%', boxSizing: 'border-box', padding: '11px 12px', borderRadius: 8, border: '1px solid #9db8d5', background: '#f8fbff', color: '#10233f' };
const primaryButtonStyle: React.CSSProperties = { display: 'inline-block', border: 0, borderRadius: 9, padding: '11px 18px', background: '#1976d2', color: 'white', fontWeight: 700, textDecoration: 'none' };
const secondaryButtonStyle: React.CSSProperties = { border: '1px solid #90caf9', borderRadius: 9, padding: '9px 14px', background: 'transparent', color: 'white', cursor: 'pointer' };
