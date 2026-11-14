'use client';

import { useAvailability } from '../context/AvailabilityContext';
import styles from './AvailabilityToggle.module.css';

export default function AvailabilityToggle({ slug, title }: { slug: string; title: string }) {
  const { isAvailable, isManagingAvailability, toggleAvailability } = useAvailability();
  const available = isAvailable(slug);

  if (!isManagingAvailability) {
    return (
      <span
        className={`${styles.status} ${available ? styles.available : styles.unavailable}`}
      >
        {available ? 'Available' : 'Not Available'}
      </span>
    );
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={available}
      aria-label={`${title} availability`}
      onClick={() => toggleAvailability(slug)}
      className={`${styles.toggle} ${available ? styles.toggleAvailable : styles.toggleUnavailable}`}
    >
      <span
        aria-hidden="true"
        className={`${styles.track} ${available ? styles.trackAvailable : styles.trackUnavailable}`}
      >
        <span className={styles.thumb} />
      </span>
      {available ? 'Available' : 'Not Available'}
    </button>
  );
}
