'use client';

import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { TEXT } from '../constants';
import styles from './page.module.css';

type UserRole = 'customer' | 'shopkeeper' | 'admin';
type ManagedUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
};

type UserPage = {
  users: ManagedUser[];
  page: number;
  totalPages: number;
  total: number;
};

export default function AdminPage() {
  const [userPage, setUserPage] = useState<UserPage>({
    users: [],
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingUserId, setLoadingUserId] = useState('');
  const [needsLogin, setNeedsLogin] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(userPage.page) });
      if (search) params.set('q', search);
      const response = await fetch(`/api/admin/users?${params.toString()}`);
      const result = await response.json();
      if (response.status === 401) {
        setNeedsLogin(true);
        return;
      }
      if (response.status === 403) {
        setAccessDenied(true);
        return;
      }
      if (!response.ok) throw new Error(result.error || TEXT.api.admin.loadFailed);
      setNeedsLogin(false);
      setAccessDenied(false);
      setUserPage(result);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : TEXT.api.admin.loadFailed);
    } finally {
      setIsLoading(false);
    }
  }, [search, userPage.page]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setUserPage((current) => ({ ...current, page: 1 }));
    setSearch(searchInput.trim());
  };

  const updateAccess = async (user: ManagedUser, role: 'customer' | 'shopkeeper') => {
    setLoadingUserId(user.id);
    setError('');
    setMessage('');
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, role }),
      });
      const result = await response.json();
      if (response.status === 401) {
        setNeedsLogin(true);
        return;
      }
      if (response.status === 403) {
        setAccessDenied(true);
        return;
      }
      if (!response.ok) throw new Error(result.error || TEXT.api.admin.updateFailed);
      setUserPage((current) => ({
        ...current,
        users: current.users.map((account) => account.id === result.user.id ? result.user : account),
      }));
      setMessage(result.message || TEXT.api.admin.accessUpdated);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : TEXT.api.admin.updateFailed);
    } finally {
      setLoadingUserId('');
    }
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>{TEXT.admin.openDashboard}</p>
          <h1>{TEXT.admin.heading}</h1>
          <p className={styles.description}>{TEXT.admin.description}</p>
        </div>
        <span className={styles.adminBadge}>{TEXT.admin.adminRole}</span>
      </header>

      {needsLogin ? (
        <section className={styles.notice}>
          <p>{TEXT.admin.loginPrompt}</p>
          <Link className={styles.link} href="/login?next=%2Fadmin">{TEXT.admin.signIn}</Link>
        </section>
      ) : accessDenied ? (
        <section className={styles.notice} role="alert">{TEXT.admin.accessDenied}</section>
      ) : (
        <>
          <section className={styles.toolbar}>
            <form className={styles.searchForm} onSubmit={handleSearch}>
              <input
                aria-label={TEXT.admin.searchPlaceholder}
                className={styles.searchInput}
                maxLength={100}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder={TEXT.admin.searchPlaceholder}
                value={searchInput}
              />
              <button className={styles.searchButton} type="submit">{TEXT.admin.search}</button>
            </form>
            <span className={styles.totalCount}>
              {TEXT.admin.users}: {userPage.total}
            </span>
          </section>

          {error && <p className={styles.error} role="alert">{error}</p>}
          {message && <p className={styles.success} role="status">{message}</p>}
          {isLoading ? (
            <p className={styles.loading}>{TEXT.admin.loading}</p>
          ) : userPage.users.length === 0 ? (
            <section className={styles.empty}>{TEXT.admin.empty}</section>
          ) : (
            <section aria-label={TEXT.admin.users} className={styles.userList}>
              {userPage.users.map((user) => (
                <article className={styles.userCard} key={user.id}>
                  <div className={styles.userDetails}>
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                    <p>{user.phone}</p>
                    <p className={styles.registered}>
                      {TEXT.admin.registered}: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={styles.accessControl}>
                    <label htmlFor={`role-${user.id}`}>{TEXT.admin.changeAccess}</label>
                    {user.role === 'admin' ? (
                      <span className={`${styles.roleBadge} ${styles.adminRole}`}>{TEXT.admin.adminRole}</span>
                    ) : (
                      <select
                        className={styles.roleSelect}
                        disabled={loadingUserId === user.id}
                        id={`role-${user.id}`}
                        onChange={(event) => void updateAccess(user, event.target.value as 'customer' | 'shopkeeper')}
                        value={user.role}
                      >
                        <option value="customer">{TEXT.admin.customer}</option>
                        <option value="shopkeeper">{TEXT.admin.shopkeeper}</option>
                      </select>
                    )}
                  </div>
                </article>
              ))}
            </section>
          )}

          {userPage.totalPages > 1 && (
            <nav aria-label="User list pages" className={styles.pagination}>
              <button
                className={styles.pageButton}
                disabled={isLoading || userPage.page <= 1}
                onClick={() => setUserPage((current) => ({ ...current, page: current.page - 1 }))}
                type="button"
              >
                {TEXT.admin.previous}
              </button>
              <span>{TEXT.admin.page(userPage.page, userPage.totalPages, userPage.total)}</span>
              <button
                className={styles.pageButton}
                disabled={isLoading || userPage.page >= userPage.totalPages}
                onClick={() => setUserPage((current) => ({ ...current, page: current.page + 1 }))}
                type="button"
              >
                {TEXT.admin.next}
              </button>
            </nav>
          )}
        </>
      )}
    </main>
  );
}
