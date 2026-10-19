'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { DEFAULT_AVAILABILITY } from '../config/availability';

type AvailabilityContextType = {
  isAvailable: (slug: string) => boolean;
  toggleAvailability: (slug: string) => Promise<void>;
  isManagingAvailability: boolean;
  toggleAvailabilityManagement: () => Promise<void>;
  availabilityError: string;
};

const AvailabilityContext = createContext<AvailabilityContextType | undefined>(undefined);

export function AvailabilityProvider({ children }: { children: React.ReactNode }) {
  const [availability, setAvailability] = useState(DEFAULT_AVAILABILITY);
  const [isManagingAvailability, setIsManagingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/availability')
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Could not load item availability.');
        if (active) setAvailability({ ...DEFAULT_AVAILABILITY, ...result.availability });
      })
      .catch((error: unknown) => {
        console.error('Could not load item availability from the server.', error);
        if (active) setAvailabilityError('Could not load item availability from the database.');
      });
    return () => { active = false; };
  }, []);

  const toggleAvailability = useCallback(async (slug: string) => {
    if (!(slug in DEFAULT_AVAILABILITY)) return;
    setAvailabilityError('');
    try {
      const response = await fetch('/api/availability', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, isAvailable: !availability[slug] }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not update availability.');
      setAvailability({ ...DEFAULT_AVAILABILITY, ...result.availability });
    } catch (error) {
      console.error('Could not update item availability.', error);
      setAvailabilityError(error instanceof Error ? error.message : 'Could not update item availability.');
    }
  }, [availability]);

  const toggleAvailabilityManagement = useCallback(async () => {
    setAvailabilityError('');
    if (isManagingAvailability) {
      setIsManagingAvailability(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/me');
      const result = await response.json();
      if (response.status === 401) {
        setAvailabilityError('Log in with a shopkeeper account to manage items.');
        return;
      }
      if (response.status === 403 || (response.ok && result.user?.role !== 'shopkeeper')) {
        setAvailabilityError('Shopkeeper access is required to manage items.');
        return;
      }
      if (!response.ok) throw new Error(result.error || 'Could not verify shopkeeper access.');
      setIsManagingAvailability(true);
    } catch (error) {
      setAvailabilityError(error instanceof Error ? error.message : 'Could not verify shopkeeper access.');
    }
  }, [isManagingAvailability]);

  const isAvailable = useCallback(
    (slug: string) => availability[slug] ?? false,
    [availability],
  );

  return (
    <AvailabilityContext.Provider
      value={{
        isAvailable,
        toggleAvailability,
        isManagingAvailability,
        toggleAvailabilityManagement,
        availabilityError,
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
