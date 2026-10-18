'use client';

import { useAvailability } from '../context/AvailabilityContext';

export default function AvailabilityToggle({ slug, title }: { slug: string; title: string }) {
  const { isAvailable, isManagingAvailability, toggleAvailability } = useAvailability();
  const available = isAvailable(slug);

  if (!isManagingAvailability) {
    return (
      <span
        style={{
          color: available ? '#9cff9c' : '#ffb3b3',
          fontSize: 12,
          fontWeight: 600,
        }}
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
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        border: 'none',
        padding: '6px 10px',
        borderRadius: 18,
        background: available ? '#245c35' : '#555',
        color: 'white',
        cursor: 'pointer',
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 30,
          height: 16,
          padding: 2,
          display: 'inline-flex',
          justifyContent: available ? 'flex-end' : 'flex-start',
          borderRadius: 10,
          background: available ? '#8ce99a' : '#aaa',
          boxSizing: 'border-box',
        }}
      >
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'white' }} />
      </span>
      {available ? 'Available' : 'Not Available'}
    </button>
  );
}
