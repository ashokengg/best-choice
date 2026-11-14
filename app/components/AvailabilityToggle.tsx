'use client';

import { useAvailability } from '../context/AvailabilityContext';
import { TEXT } from '../constants';
import styles from './AvailabilityToggle.module.css';

export default function AvailabilityToggle({ slug, title }: { slug: string; title: string }) {
  const { isAvailable, isManagingAvailability, toggleAvailability } = useAvailability();
  const available = isAvailable(slug);

  if (!isManagingAvailability) {
    return (
      <span
        className={`${styles.status} ${available ? styles.available : styles.unavailable}`}
      >
        {available ? TEXT.common.available : TEXT.common.notAvailable}
      </span>
    );
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={available}
      aria-label={TEXT.availability.label(title)}
      onClick={() => toggleAvailability(slug)}
      className={`${styles.toggle} ${available ? styles.toggleAvailable : styles.toggleUnavailable}`}
    >
      <span
        aria-hidden="true"
        className={`${styles.track} ${available ? styles.trackAvailable : styles.trackUnavailable}`}
      >
        <span className={styles.thumb} />
      </span>
      {available ? TEXT.common.available : TEXT.common.notAvailable}
    </button>
  );
}
