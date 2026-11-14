'use client';
import Link from 'next/link'
import Image from 'next/image';
import "./globals.css";
import { usePathname, useRouter } from 'next/navigation';
import { Button, Menu, MenuItem } from '@mui/material';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useCallback, useEffect, useState } from 'react';
import { useCart } from './context/CartContext';
import { useFavorites } from './context/FavoritesContext';
import { useAvailability } from './context/AvailabilityContext';
import { useSearch } from './components/searchBar';
import SearchProductsModal from './components/SearchProductsModal';
import { PRODUCTS } from './config/products';
import { DEFAULT_SPECIAL_ITEMS, MAX_SPECIAL_ITEMS } from './config/specialItems';
import styles from './Header.module.css';

function Header() { 
const router = useRouter();
const pathname = usePathname();
const { searchTerm, setSearchTerm } = useSearch();
const { cartCount } = useCart();
const { favoriteCount } = useFavorites();
const { isManagingAvailability, toggleAvailabilityManagement, availabilityError } = useAvailability();
const [isSignedIn, setIsSignedIn] = useState(false);
const [isShopkeeper, setIsShopkeeper] = useState(false);
const [userName, setUserName] = useState('');
const [userEmail, setUserEmail] = useState('');
const [userPhone, setUserPhone] = useState('');
const [authError, setAuthError] = useState('');
const [accountMenuAnchor, setAccountMenuAnchor] = useState<HTMLElement | null>(null);
const [specialItems, setSpecialItems] = useState<string[]>(DEFAULT_SPECIAL_ITEMS);
const [specialItemsDraft, setSpecialItemsDraft] = useState<string[]>(DEFAULT_SPECIAL_ITEMS);
const [isEditingSpecialItems, setIsEditingSpecialItems] = useState(false);
const [isSavingSpecialItems, setIsSavingSpecialItems] = useState(false);
const [specialItemsError, setSpecialItemsError] = useState('');
const isProductDetailsPage = PRODUCTS.some((product) => pathname === `/${product.slug}`);
const closeProductSearch = useCallback(() => setSearchTerm(''), [setSearchTerm]);
const visibleSpecialItems = specialItems
  .map((slug) => PRODUCTS.find((product) => product.slug === slug))
  .filter((product) => product !== undefined);

  useEffect(() => {
    let active = true;
    fetch('/api/auth/me')
      .then(async (response) => {
        if (response.status === 401) {
            if (active) {
              setIsSignedIn(false);
              setIsShopkeeper(false);
              setUserName('');
              setUserEmail('');
              setUserPhone('');
            }
            return;
          }
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || 'Could not check your account.');
          if (active) {
            setIsSignedIn(true);
            setIsShopkeeper(result.user?.role === 'shopkeeper');
            setUserName(typeof result.user?.name === 'string' ? result.user.name : '');
            setUserEmail(typeof result.user?.email === 'string' ? result.user.email : '');
            setUserPhone(typeof result.user?.phone === 'string' ? result.user.phone : '');
          }
      })
      .catch((error: unknown) => {
        console.error('Could not check signed-in status.', error);
        if (active) {
          setIsShopkeeper(false);
          setAuthError('Account status is unavailable.');
        }
      });
    return () => { active = false; };
  }, [pathname]);

  useEffect(() => {
    let active = true;
    fetch('/api/special-items')
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Could not load special items.');
        if (!Array.isArray(result.items) || !result.items.every((slug: unknown) =>
          typeof slug === 'string' && PRODUCTS.some((product) => product.slug === slug),
        )) {
          throw new Error('The saved special items are invalid.');
        }
        if (active) {
          setSpecialItems(result.items);
          setSpecialItemsError('');
        }
      })
      .catch((error: unknown) => {
        console.error('Could not load header special items.', error);
        if (active) setSpecialItemsError(error instanceof Error ? error.message : 'Could not load special items.');
      });
    return () => { active = false; };
  }, []);

  const handleAccountButton = async () => {
    if (!isSignedIn) {
      router.push('/login');
      return;
    }
    setAuthError('');
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not log out.');
      setIsSignedIn(false);
      setIsShopkeeper(false);
      setUserName('');
      setUserEmail('');
      setUserPhone('');
      setAccountMenuAnchor(null);
      router.push('/login');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Could not log out.');
    }
  };

  const handleManageItemsClick = () => {
    if (!isManagingAvailability && window.location.pathname !== '/') {
      router.push('/');
    }
    toggleAvailabilityManagement();
  };

  const toggleSpecialItem = (slug: string) => {
    setSpecialItemsDraft((current) => {
      if (current.includes(slug)) return current.filter((itemSlug) => itemSlug !== slug);
      if (current.length >= MAX_SPECIAL_ITEMS) return current;
      return [...current, slug];
    });
  };

  const openSpecialItemsEditor = () => {
    setSpecialItemsDraft(specialItems);
    setSpecialItemsError('');
    setIsEditingSpecialItems(true);
  };

  const saveSpecialItems = async () => {
    setIsSavingSpecialItems(true);
    setSpecialItemsError('');
    try {
      const response = await fetch('/api/special-items', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: specialItemsDraft }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not save special items.');
      if (!Array.isArray(result.items)) throw new Error('The server returned an invalid special items list.');
      setSpecialItems(result.items);
      setIsEditingSpecialItems(false);
    } catch (error) {
      console.error('Could not save header special items.', error);
      setSpecialItemsError(error instanceof Error ? error.message : 'Could not save special items.');
    } finally {
      setIsSavingSpecialItems(false);
    }
  };

  return (
    <>
    <nav className="header">
      <div className="header-main">
        <div className="header-brand">
          <div className="header-logo-group">
            <Link href="/" className="header-logo-link" aria-label="TiffinNest home">
              <Image
                src="/images/TiffinNest_logo6.svg.png"
                alt="TiffinNest — Good Food. Closer to You."
                width={440}
                height={220}
                quality={100}
                sizes="(max-width: 560px) 130px, 150px"
                priority
                className="header-logo"
              />
            </Link>
          </div>
          <div className="header-welcome">
            <span>LALITHA</span>
            <span>HOME FOODS</span>
          </div>
        </div>
        <div className="header-actions">
          <Link aria-label={`Favourites, ${favoriteCount} saved`} className="header-favorites-link" href="/favorites">
            <FavoriteBorderIcon aria-hidden="true" />
            <span>Favourites</span>
            {favoriteCount > 0 && <span className="header-favorites-count">{favoriteCount}</span>}
          </Link>
          {isShopkeeper && (
            <div className="header-search-tools">
              <Button
                type="button"
                aria-pressed={isManagingAvailability}
                onClick={handleManageItemsClick}
                className={`${styles.manageButton} ${isManagingAvailability ? styles.manageButtonActive : styles.manageButtonInactive}`}
              >
                {isManagingAvailability ? 'Done' : 'Manage Items'}
              </Button>
            </div>
          )}
          {availabilityError && <span role="alert" className="header-error">{availabilityError}</span>}
          <Badge badgeContent={cartCount} color="secondary">
            <ShoppingCartIcon
              aria-label="Shopping cart"
              onClick={() => router.push('/cart')}
              className={styles.cartIcon}
            />
          </Badge>
          <Button
            onClick={handleAccountButton}
            className={`header-action-button ${styles.loginButton}`}
          >
            {isSignedIn ? 'LOGOUT' : 'LOGIN'}
          </Button>
          <Button
            type="button"
            aria-label="Open account menu"
            aria-controls={accountMenuAnchor ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={accountMenuAnchor ? 'true' : undefined}
            onClick={(event) => setAccountMenuAnchor(event.currentTarget)}
            className={styles.accountButton}
          >
            <MenuIcon />
          </Button>
          <Menu
            id="account-menu"
            anchorEl={accountMenuAnchor}
            open={Boolean(accountMenuAnchor)}
            onClose={() => setAccountMenuAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <div className="account-menu-customer">
              <strong>{isSignedIn ? userName || 'Customer' : 'Guest'}</strong>
              {userEmail && <span>{userEmail}</span>}
              {userPhone && <span>{userPhone}</span>}
            </div>
            <MenuItem
              onClick={() => {
                setAccountMenuAnchor(null);
                router.push('/orders');
              }}
            >
              Order History
            </MenuItem>
          </Menu>
          {authError && <span role="alert" className="header-error">{authError}</span>}
        </div>
      </div>
      <div className="header-categories">
        <input
          type="text"
          spellCheck={false}
          placeholder="Search your favorite food..."
          className="search-input header-category-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className={`header-category-group ${styles.specialCategoryGroup}`}>
          <div className={styles.specialHeading}>
            <h3>ORDER SPECIAL ITEMS :</h3>
            {isShopkeeper && (
              <button
                aria-expanded={isEditingSpecialItems}
                className={styles.specialManageButton}
                onClick={isEditingSpecialItems ? () => setIsEditingSpecialItems(false) : openSpecialItemsEditor}
                type="button"
              >
                {isEditingSpecialItems ? 'Close' : 'Manage'}
              </button>
            )}
          </div>
          <div className="header-category-links">
            {visibleSpecialItems.map((product) => (
              <Link className="snacks" href={`/${product.slug}`} key={product.slug}>
                {product.title.toUpperCase()}
              </Link>
            ))}
          </div>
          {isEditingSpecialItems && isShopkeeper && (
            <section aria-label="Manage header special items" className={styles.specialEditor}>
              <p className={styles.specialEditorTitle}>Choose up to {MAX_SPECIAL_ITEMS} items</p>
              <p className={styles.specialEditorCount}>{specialItemsDraft.length}/{MAX_SPECIAL_ITEMS} selected</p>
              <div className={styles.specialOptions}>
                {PRODUCTS.map((product) => (
                  <label className={styles.specialOption} key={product.slug}>
                    <input
                      checked={specialItemsDraft.includes(product.slug)}
                      disabled={!specialItemsDraft.includes(product.slug) && specialItemsDraft.length >= MAX_SPECIAL_ITEMS}
                      onChange={() => toggleSpecialItem(product.slug)}
                      type="checkbox"
                    />
                    {product.title}
                  </label>
                ))}
              </div>
              {specialItemsError && <p className={styles.specialError} role="alert">{specialItemsError}</p>}
              <div className={styles.specialEditorActions}>
                <button
                  className={styles.specialCancel}
                  disabled={isSavingSpecialItems}
                  onClick={() => setIsEditingSpecialItems(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className={styles.specialSave}
                  disabled={isSavingSpecialItems}
                  onClick={saveSpecialItems}
                  type="button"
                >
                  {isSavingSpecialItems ? 'Saving…' : 'Save'}
                </button>
              </div>
            </section>
          )}
          {!isEditingSpecialItems && specialItemsError && (
            <span className="header-error" role="alert">{specialItemsError}</span>
          )}
        </div>
      </div>
    </nav>
    {isProductDetailsPage && searchTerm.trim() && (
      <SearchProductsModal searchTerm={searchTerm} onClose={closeProductSearch} />
    )}
    </>
  )
}

export default Header