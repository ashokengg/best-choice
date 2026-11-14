'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { TEXT } from '../constants';
import styles from './SankrantiAnimation.module.css';

const ANIMATION_CHANGE_EVENT = 'festival-animation-change';
const CELEBRATION_DURATION_MS = 5200;

export default function SankrantiAnimation() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/api/festival-animation')
      .then(async (response) => {
        const result: unknown = await response.json();
        if (!response.ok) {
          throw new Error(TEXT.header.festivalAnimationLoadError);
        }
        if (
          !result ||
          typeof result !== 'object' ||
          typeof (result as Record<string, unknown>).enabled !== 'boolean'
        ) {
          throw new Error(TEXT.header.festivalAnimationInvalidSetting);
        }
        if (active) setEnabled((result as { enabled: boolean }).enabled);
      })
      .catch((error: unknown) => {
        console.error('Could not load the festival animation setting.', error);
      });

    const handleSettingChange = (event: Event) => {
      const { detail } = event as CustomEvent<boolean>;
      if (typeof detail === 'boolean') setEnabled(detail);
    };
    window.addEventListener(ANIMATION_CHANGE_EVENT, handleSettingChange);

    return () => {
      active = false;
      window.removeEventListener(ANIMATION_CHANGE_EVENT, handleSettingChange);
    };
  }, []);

  useEffect(() => {
    if (pathname !== '/' || !enabled) {
      const hideFrame = window.requestAnimationFrame(() => setIsVisible(false));
      return () => window.cancelAnimationFrame(hideFrame);
    }

    const showFrame = window.requestAnimationFrame(() => setIsVisible(true));
    const timeout = window.setTimeout(
      () => setIsVisible(false),
      CELEBRATION_DURATION_MS,
    );
    return () => {
      window.cancelAnimationFrame(showFrame);
      window.clearTimeout(timeout);
    };
  }, [enabled, pathname]);

  if (!isVisible) return null;

  return (
    <div aria-label={TEXT.festival.celebrationLabel} className={styles.celebration} role="status">
      <span aria-hidden="true" className={`${styles.kite} ${styles.kiteOne}`}>🪁</span>
      <span aria-hidden="true" className={`${styles.kite} ${styles.kiteTwo}`}>🪁</span>
      <span aria-hidden="true" className={`${styles.kite} ${styles.kiteThree}`}>🪁</span>
      <div className={styles.message}>
        <span aria-hidden="true" className={styles.sun}>☀</span>
        <span>{TEXT.festival.greeting}</span>
        <span aria-hidden="true" className={styles.harvest}>✦</span>
      </div>
      <span aria-hidden="true" className={`${styles.kite} ${styles.kiteFour}`}>🪁</span>
    </div>
  );
}
