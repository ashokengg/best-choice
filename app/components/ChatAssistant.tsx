'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import CloseRounded from '@mui/icons-material/CloseRounded';
import SmartToyOutlined from '@mui/icons-material/SmartToyOutlined';
import SendRounded from '@mui/icons-material/SendRounded';
import { MENU_PRODUCTS, PRODUCTS, type Product } from '../config/products';
import { TEXT } from '../constants';
import styles from './ChatAssistant.module.css';

type ChatLink = {
  href: string;
  label: string;
};

type ChatMessage = {
  id: number;
  role: 'assistant' | 'user';
  text: string;
  products?: Product[];
  links?: ChatLink[];
};

function createReply(query: string): Omit<ChatMessage, 'id' | 'role'> {
  const normalized = query.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').trim();
  const product = [...PRODUCTS]
    .sort((a, b) => b.title.length - a.title.length)
    .find((item) => normalized.includes(item.title.toLowerCase()) || normalized.includes(item.slug));

  if (product) {
    return {
      text: `${product.tagline}. ${product.detailDescription ?? ''}`.trim(),
      products: [product],
      links: [{ href: `/${product.slug}`, label: TEXT.chat.viewItem }],
    };
  }

  if (/\b(menu|dishes|items|food|snacks|what can i order)\b/.test(normalized)) {
    return {
      text: TEXT.chat.menuReply,
      products: MENU_PRODUCTS.slice(0, 4),
      links: [{ href: '/#menu', label: TEXT.chat.browseMenu }],
    };
  }

  if (/\b(track|tracking|order status|order history|past orders)\b/.test(normalized)) {
    return {
      text: TEXT.chat.ordersReply,
      links: [{ href: '/orders', label: TEXT.chat.viewOrders }],
    };
  }

  if (/\b(favourite|favorites|favourites|saved)\b/.test(normalized)) {
    return {
      text: TEXT.chat.favoritesReply,
      links: [{ href: '/favorites', label: TEXT.chat.viewFavorites }],
    };
  }

  if (/\b(cart|checkout|pay|payment|order|buy)\b/.test(normalized)) {
    return {
      text: TEXT.chat.orderReply,
      links: [
        { href: '/#menu', label: TEXT.chat.browseMenu },
        { href: '/cart', label: TEXT.chat.openCart },
      ],
    };
  }

  if (/\b(delivery|deliver|hours|open|closing|contact|phone|address)\b/.test(normalized)) {
    return {
      text: TEXT.chat.unspecifiedReply,
      links: [{ href: '/about', label: TEXT.chat.aboutUs }],
    };
  }

  if (/\b(hi|hello|hey|help)\b/.test(normalized)) {
    return {
      text: TEXT.chat.greetingReply,
      links: [
        { href: '/#menu', label: TEXT.chat.browseMenu },
        { href: '/orders', label: TEXT.chat.viewOrders },
      ],
    };
  }

  return {
    text: TEXT.chat.fallbackReply,
    links: [
      { href: '/#menu', label: TEXT.chat.browseMenu },
      { href: '/cart', label: TEXT.chat.openCart },
    ],
  };
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, role: 'assistant', text: TEXT.chat.welcome },
  ]);
  const nextId = useRef(1);
  const conversationRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    conversationRef.current?.scrollTo({ top: conversationRef.current.scrollHeight, behavior: 'smooth' });
    inputRef.current?.focus();
  }, [isOpen, messages]);

  const sendMessage = (message: string) => {
    const text = message.trim();
    if (!text) return;

    setMessages((current) => [
      ...current,
      { id: nextId.current++, role: 'user', text },
      { id: nextId.current++, role: 'assistant', ...createReply(text) },
    ]);
    setInput('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(input);
  };

  return (
    <div className={styles.widget}>
      {isOpen && (
        <section
          aria-label={TEXT.chat.title}
          aria-modal="false"
          className={styles.panel}
          role="dialog"
        >
          <header className={styles.header}>
            <span className={styles.avatar} aria-hidden="true">
              <SmartToyOutlined />
            </span>
            <div className={styles.headerText}>
              <strong>{TEXT.chat.title}</strong>
              <span>{TEXT.chat.subtitle}</span>
            </div>
            <button
              aria-label={TEXT.chat.close}
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              type="button"
            >
              <CloseRounded />
            </button>
          </header>

          <div className={styles.conversation} ref={conversationRef} aria-live="polite">
            {messages.map((message) => (
              <article
                className={`${styles.message} ${message.role === 'user' ? styles.userMessage : styles.assistantMessage}`}
                key={message.id}
              >
                <p>{message.text}</p>
                {message.products?.map((product) => (
                  <div className={styles.productCard} key={product.slug}>
                    <span>{product.title}</span>
                    <span>{TEXT.money.symbol}{product.price}</span>
                  </div>
                ))}
                {message.links && (
                  <div className={styles.messageLinks}>
                    {message.links.map((link) => (
                      <Link href={link.href} key={link.href}>{link.label}</Link>
                    ))}
                  </div>
                )}
              </article>
            ))}
            {messages.length === 1 && (
              <div className={styles.quickQuestions}>
                {[TEXT.chat.menuQuestion, TEXT.chat.orderQuestion, TEXT.chat.trackQuestion].map((question) => (
                  <button key={question} onClick={() => sendMessage(question)} type="button">
                    {question}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form className={styles.composer} onSubmit={handleSubmit}>
            <label className={styles.visuallyHidden} htmlFor="chat-message">{TEXT.chat.inputLabel}</label>
            <input
              autoComplete="off"
              id="chat-message"
              maxLength={300}
              onChange={(event) => setInput(event.target.value)}
              placeholder={TEXT.chat.placeholder}
              ref={inputRef}
              value={input}
            />
            <button aria-label={TEXT.chat.send} disabled={!input.trim()} type="submit">
              <SendRounded />
            </button>
          </form>
        </section>
      )}
      <button
        aria-expanded={isOpen}
        aria-label={isOpen ? TEXT.chat.close : TEXT.chat.open}
        className={styles.launcher}
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        {isOpen ? <CloseRounded /> : <SmartToyOutlined />}
      </button>
    </div>
  );
}
