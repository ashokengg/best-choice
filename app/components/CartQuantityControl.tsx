'use client';

import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Tooltip } from '@mui/material';
import { useAvailability } from '../context/AvailabilityContext';
import { MAX_CART_TOTAL, MAX_ITEM_QUANTITY, useCart } from '../context/CartContext';
import { TEXT } from '../constants';
import styles from './CartQuantityControl.module.css';

type CartItemInput = {
  slug: string;
  title: string;
  price: number;
  img?: string;
};

export default function CartQuantityControl({ item }: { item: CartItemInput }) {
  const { cartItems, addToCart, increaseQty, decreaseQty, setQuantity, removeItem } = useCart();
  const { isAvailable } = useAvailability();
  const quantity = cartItems.find((cartItem) => cartItem.slug === item.slug)?.quantity ?? 0;
  const [quantityDraft, setQuantityDraft] = useState<{ baseQuantity: number; value: string } | null>(null);
  const otherItemsTotal = cartItems.reduce(
    (total, cartItem) =>
      total + (cartItem.slug === item.slug ? 0 : cartItem.price * cartItem.quantity),
    0
  );
  const maxQuantity = Math.min(
    MAX_ITEM_QUANTITY,
    item.price > 0 ? Math.floor((MAX_CART_TOTAL - otherItemsTotal) / item.price) : MAX_ITEM_QUANTITY
  );
  const limitReached = quantity >= maxQuantity;
  const limitMessage = quantity >= MAX_ITEM_QUANTITY
    ? TEXT.quantity.maximumPerItem(MAX_ITEM_QUANTITY)
    : TEXT.quantity.cartTotalLimit;
  const activeDraft = quantityDraft?.baseQuantity === quantity ? quantityDraft.value : null;
  const quantityInput = activeDraft ?? String(quantity);
  const draftQuantity = activeDraft !== null && /^\d+$/.test(activeDraft)
    ? Number(activeDraft)
    : null;
  const quantityError = draftQuantity !== null && draftQuantity > MAX_ITEM_QUANTITY
    ? TEXT.quantity.maximumPerItem(MAX_ITEM_QUANTITY)
    : draftQuantity !== null && draftQuantity > maxQuantity
      ? TEXT.quantity.cartTotalLimit
      : '';
  const available = isAvailable(item.slug);

  const increase = () => {
    if (!available) return;
    if (quantity === 0) {
      addToCart(item);
      return;
    }
    increaseQty(item.slug);
  };

  const decrease = () => {
    if (quantity === 1) {
      removeItem(item.slug);
      return;
    }
    if (quantity > 1) decreaseQty(item.slug);
  };

  const updateQuantity = (value: string) => {
    setQuantityDraft({ baseQuantity: quantity, value });
    if (!/^\d+$/.test(value) || value === '') return;

    const nextQuantity = Number(value);
    if (nextQuantity > MAX_ITEM_QUANTITY || nextQuantity > maxQuantity) return;
    if (nextQuantity >= 1) setQuantity(item.slug, nextQuantity);
  };

  return (
    <div
      aria-label={TEXT.quantity.label(item.title)}
      className={`${styles.control}${quantity > 0 ? ` ${styles.expanded}` : ` ${styles.addState}`}`}
    >
      {quantity > 0 && (
        <button
          aria-label={TEXT.quantity.decrease(item.title)}
          className={styles.button}
          onClick={decrease}
          type="button"
        >
          <RemoveIcon fontSize="small" />
        </button>
      )}
      <Tooltip arrow open={Boolean(quantityError)} placement="top" title={quantityError}>
        <span className={styles.tooltipTarget}>
          {quantity > 0 && (
            <input
              aria-label={TEXT.quantity.label(item.title)}
              aria-invalid={Boolean(quantityError)}
              className={styles.value}
              inputMode="numeric"
              onBlur={() => setQuantityDraft(null)}
              onChange={(event) => updateQuantity(event.target.value)}
              type="text"
              value={quantityInput}
            />
          )}
        </span>
      </Tooltip>
      <Tooltip
        arrow
        placement="top"
        title={!available ? '' : limitReached ? limitMessage : ''}
        disableHoverListener={!available || !limitReached}
      >
        <span className={styles.tooltipTarget}>
          <button
            aria-label={available ? TEXT.quantity.increase(item.title) : TEXT.availability.unavailableAria(item.title)}
            className={`${styles.button}${quantity === 0 ? ` ${styles.addButton}` : ''}`}
            disabled={!available || limitReached}
            onClick={increase}
            type="button"
          >
            {quantity === 0 ? TEXT.quantity.add : <AddIcon fontSize="small" />}
          </button>
        </span>
      </Tooltip>
    </div>
  );
}
