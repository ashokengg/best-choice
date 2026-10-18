'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'best-choice-item-availability';
const DEFAULT_AVAILABILITY: Record<string, boolean> = {
  dosa: false,
  bonda: true,
  bajji: true,
  'medu-vada': true,
  'masala-vada': true,
  puri: false,
  idli: false,
  upma: false,
  pesarattu: false,
  samosa: false,
  pakora: false,
  'bhel-puri': false,
  'sev-puri': false,
  'pav-bhaji': false,
  jalebi: false,
};

type AvailabilityContextType = {
  isAvailable: (slug: string) => boolean;
  toggleAvailability: (slug: string) => void;
  isManagingAvailability: boolean;
  toggleAvailabilityManagement: () => void;
};

const AvailabilityContext = createContext<AvailabilityContextType | undefined>(undefined);

function parseAvailability(value: string | null): Record<string, boolean> {
  if (!value) return DEFAULT_AVAILABILITY;

  try {
    const parsed: unknown = JSON.parse(value);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return DEFAULT_AVAILABILITY;
    }

    const stored = parsed as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(DEFAULT_AVAILABILITY).map(([slug, defaultValue]) => [
        slug,
        typeof stored[slug] === 'boolean' ? stored[slug] : defaultValue,
      ])
    );
  } catch (error) {
    console.error('Could not read saved item availability.', error);
    return DEFAULT_AVAILABILITY;
  }
}

export function AvailabilityProvider({ children }: { children: React.ReactNode }) {
  const [availability, setAvailability] = useState(DEFAULT_AVAILABILITY);
  const [isManagingAvailability, setIsManagingAvailability] = useState(false);

  useEffect(() => {
    try {
      setAvailability(parseAvailability(window.localStorage.getItem(STORAGE_KEY)));
    } catch (error) {
      console.error('Could not load saved item availability.', error);
    }

    const syncAvailability = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setAvailability(parseAvailability(event.newValue));
      }
    };

    window.addEventListener('storage', syncAvailability);
    return () => window.removeEventListener('storage', syncAvailability);
  }, []);

  const toggleAvailability = useCallback((slug: string) => {
    if (!(slug in DEFAULT_AVAILABILITY)) return;

    const next = { ...availability, [slug]: !availability[slug] };
    setAvailability(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      console.error('Could not save item availability.', error);
    }
  }, [availability]);

  const isAvailable = useCallback(
    (slug: string) => availability[slug] ?? false,
    [availability]
  );
  const toggleAvailabilityManagement = useCallback(() => {
    setIsManagingAvailability((current) => !current);
  }, []);

  return (
    <AvailabilityContext.Provider
      value={{
        isAvailable,
        toggleAvailability,
        isManagingAvailability,
        toggleAvailabilityManagement,
      }}
    >
      {children}
    </AvailabilityContext.Provider>
  );
}

export function useAvailability() {
  const context = useContext(AvailabilityContext);
  if (!context) throw new Error('useAvailability must be used within an AvailabilityProvider');
  return context;
}
