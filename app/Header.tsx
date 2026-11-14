'use client';
import Link from 'next/link'
import Image from 'next/image';
import "./globals.css";
import { usePathname, useRouter } from 'next/navigation';
import { Button, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import { useCallback, useEffect, useState } from 'react';
import { useFavorites } from './context/FavoritesContext';
import { useAvailability } from './context/AvailabilityContext';
import { useSearch } from './components/searchBar';
import SearchProductsModal from './components/SearchProductsModal';
import { SHOP_LOCATION } from './config/shop';
import { PRODUCTS } from './config/products';
import { DEFAULT_SPECIAL_ITEMS, MAX_SPECIAL_ITEMS } from './config/specialItems';
import { TEXT } from './constants';
import styles from './Header.module.css';

function Header() { 
const router = useRouter();
const pathname = usePathname();
const { searchTerm, setSearchTerm } = useSearch();
const { favoriteCount } = useFavorites();
const { isManagingAvailability, toggleAvailabilityManagement, availabilityError } = useAvailability();
const [isSignedIn, setIsSignedIn] = useState(false);
const [isShopkeeper, setIsShopkeeper] = useState(false);
const [isAdmin, setIsAdmin] = useState(false);
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
const [festivalAnimationEnabled, setFestivalAnimationEnabled] = useState(false);
const [isFestivalAnimationLoading, setIsFestivalAnimationLoading] = useState(true);
const [isFestivalAnimationSaving, setIsFestivalAnimationSaving] = useState(false);
const [festivalAnimationError, setFestivalAnimationError] = useState('');
const [isGettingDirections, setIsGettingDirections] = useState(false);
const [directionsError, setDirectionsError] = useState('');
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
              setIsAdmin(false);
              setUserName('');
              setUserEmail('');
              setUserPhone('');
            }
            return;
          }
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || TEXT.checkout.accountError);
          if (active) {
            setIsSignedIn(true);
            setIsShopkeeper(result.user?.role === 'shopkeeper');
            setIsAdmin(result.user?.role === 'admin');
            setUserName(typeof result.user?.name === 'string' ? result.user.name : '');
            setUserEmail(typeof result.user?.email === 'string' ? result.user.email : '');
            setUserPhone(typeof result.user?.phone === 'string' ? result.user.phone : '');
          }
      })
      .catch((error: unknown) => {
        console.error('Could not check signed-in status.', error);
        if (active) {
          setIsShopkeeper(false);
          setIsAdmin(false);
          setAuthError(TEXT.header.accountUnavailable);
        }
      });
    return () => { active = false; };
  }, [pathname]);

  useEffect(() => {
    let active = true;
    fetch('/api/special-items')
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || TEXT.header.loadSpecialItemsError);
        if (!Array.isArray(result.items) || !result.items.every((slug: unknown) =>
          typeof slug === 'string' && PRODUCTS.some((product) => product.slug === slug),
        )) {
          throw new Error(TEXT.header.invalidSavedSpecialItems);
        }
        if (active) {
          setSpecialItems(result.items);
          setSpecialItemsError('');
        }
      })
      .catch((error: unknown) => {
        console.error('Could not load header special items.', error);
        if (active) setSpecialItemsError(error instanceof Error ? error.message : TEXT.header.loadSpecialItemsError);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/festival-animation')
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || TEXT.header.festivalAnimationLoadError);
        if (typeof result.enabled !== 'boolean') {
          throw new Error(TEXT.header.festivalAnimationInvalidSetting);
        }
        if (active) setFestivalAnimationEnabled(result.enabled);
      })
      .catch((error: unknown) => {
        console.error('Could not load the festival animation setting.', error);
        if (active) setFestivalAnimationError(
          error instanceof Error ? error.message : TEXT.header.festivalAnimationLoadError,
        );
      })
      .finally(() => {
        if (active) setIsFestivalAnimationLoading(false);
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
      if (!response.ok) throw new Error(result.error || TEXT.header.logoutError);
      setIsSignedIn(false);
      setIsShopkeeper(false);
      setIsAdmin(false);
      setUserName('');
      setUserEmail('');
      setUserPhone('');
      setAccountMenuAnchor(null);
      router.push('/login');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : TEXT.header.logoutError);
    }
  };

  const handleManageItemsClick = () => {
    if (!isManagingAvailability && window.location.pathname !== '/') {
      router.push('/');
    }
    toggleAvailabilityManagement();
  };

  const openShopDirections = () => {
    setDirectionsError('');
    if (!navigator.geolocation) {
      setDirectionsError(TEXT.header.locationUnavailable);
      return;
    }

    const mapsWindow = window.open('about:blank', '_blank');
    if (mapsWindow) mapsWindow.opener = null;
    setIsGettingDirections(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const origin = `${position.coords.latitude},${position.coords.longitude}`;
        const destination = `${SHOP_LOCATION.latitude},${SHOP_LOCATION.longitude}`;
        const mapsUrl = new URL('https://www.google.com/maps/dir/');
        mapsUrl.search = new URLSearchParams({
          api: '1',
          origin,
          destination,
          travelmode: 'driving',
        }).toString();
        if (mapsWindow && !mapsWindow.closed) {
          mapsWindow.location.href = mapsUrl.toString();
        } else {
          window.location.assign(mapsUrl.toString());
        }
        setIsGettingDirections(false);
      },
      (error) => {
        if (mapsWindow && !mapsWindow.closed) mapsWindow.close();
        setDirectionsError(
          error.code === error.PERMISSION_DENIED
            ? TEXT.header.locationPermissionDenied
            : error.code === error.POSITION_UNAVAILABLE
              ? TEXT.header.locationUnavailable
              : TEXT.header.locationTimeout,
        );
        setIsGettingDirections(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 },
    );
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
      if (!response.ok) throw new Error(result.error || TEXT.header.saveSpecialItemsError);
      if (!Array.isArray(result.items)) throw new Error(TEXT.header.invalidServerSpecialItems);
      setSpecialItems(result.items);
      setIsEditingSpecialItems(false);
    } catch (error) {
      console.error('Could not save header special items.', error);
      setSpecialItemsError(error instanceof Error ? error.message : TEXT.header.saveSpecialItemsError);
    } finally {
      setIsSavingSpecialItems(false);
    }
  };

  const toggleFestivalAnimation = async () => {
    setIsFestivalAnimationSaving(true);
    setFestivalAnimationError('');
    try {
      const response = await fetch('/api/festival-animation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !festivalAnimationEnabled }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || TEXT.header.festivalAnimationUpdateError);
      if (typeof result.enabled !== 'boolean') {
        throw new Error(TEXT.header.festivalAnimationInvalidSetting);
      }
      setFestivalAnimationEnabled(result.enabled);
      window.dispatchEvent(new CustomEvent('festival-animation-change', { detail: result.enabled }));
    } catch (error) {
      console.error('Could not update the festival animation setting.', error);
      setFestivalAnimationError(
        error instanceof Error ? error.message : TEXT.header.festivalAnimationUpdateError,
      );
    } finally {
      setIsFestivalAnimationSaving(false);
    }
  };

  return (
    <>
    <nav className="header">
      <div className="header-main">
        <div className="header-brand">
          <div className="header-logo-group">
            <Link href="/" className="header-logo-link" aria-label={TEXT.header.homeAria}>
              <Image
                src="/images/TiffinNest_logo6.svg.png"
                alt={TEXT.header.logoAlt}
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
            <span>{TEXT.header.brand}</span>
            <span>{TEXT.header.brandSubtitle}</span>
          </div>
        </div>
        <div className="header-actions">
          <div className="header-mobile-shortcuts">
            <Link aria-label={TEXT.header.favoritesAria(favoriteCount)} className="header-favorites-link" href="/favorites">
              <FavoriteBorderIcon aria-hidden="true" />
              <span>{TEXT.header.favorites}</span>
              {favoriteCount > 0 && <span className="header-favorites-count">{favoriteCount}</span>}
            </Link>
            <Button
              aria-label={TEXT.header.directions}
              className={styles.directionsButton}
              disabled={isGettingDirections}
              onClick={openShopDirections}
              title={TEXT.header.directions}
              type="button"
            >
              <MapOutlinedIcon aria-hidden="true" />
            </Button>
          </div>
          <div className="header-account-actions">
            {isShopkeeper && (
              <div className="header-search-tools">
                <Button
                  type="button"
                  aria-pressed={isManagingAvailability}
                  onClick={handleManageItemsClick}
                  className={`${styles.manageButton} ${isManagingAvailability ? styles.manageButtonActive : styles.manageButtonInactive}`}
                >
                  {isManagingAvailability ? TEXT.header.done : TEXT.header.manageItems}
                </Button>
              </div>
            )}
            {availabilityError && <span role="alert" className="header-error header-availability-error">{availabilityError}</span>}
            <Button
              onClick={handleAccountButton}
              className={`header-action-button ${styles.loginButton}`}
            >
              {isSignedIn ? TEXT.header.logout : TEXT.header.login}
            </Button>
            <Button
              type="button"
              aria-label={TEXT.header.accountMenu}
              aria-controls={accountMenuAnchor ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={accountMenuAnchor ? 'true' : undefined}
              onClick={(event) => setAccountMenuAnchor(event.currentTarget)}
              className={`header-account-menu-button ${styles.accountButton}`}
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
                <strong>{isSignedIn ? userName || TEXT.header.customer : TEXT.header.guest}</strong>
                {userEmail && <span>{userEmail}</span>}
                {userPhone && <span>{userPhone}</span>}
              </div>
              <MenuItem
                onClick={() => {
                  setAccountMenuAnchor(null);
                  router.push('/orders');
                }}
              >
                {TEXT.header.orderHistory}
              </MenuItem>
              {isAdmin && (
                <MenuItem
                  onClick={() => {
                    setAccountMenuAnchor(null);
                    router.push('/admin');
                  }}
                >
                  {TEXT.admin.openDashboard}
                </MenuItem>
              )}
              {isShopkeeper && (
                <div className={styles.shopkeeperSettings}>
                  <p className={styles.settingsHeading}>{TEXT.header.shopSettings}</p>
                  <button
                    aria-pressed={festivalAnimationEnabled}
                    className={`${styles.festivalAnimationButton} ${festivalAnimationEnabled ? styles.festivalAnimationActive : ''}`}
                    disabled={isFestivalAnimationLoading || isFestivalAnimationSaving}
                    onClick={toggleFestivalAnimation}
                    type="button"
                  >
                    {isFestivalAnimationSaving
                      ? TEXT.header.saving
                      : festivalAnimationEnabled
                        ? TEXT.header.festivalAnimationOn
                        : TEXT.header.festivalAnimationOff}
                  </button>
                  {festivalAnimationError && (
                    <p className={styles.settingsError} role="alert">{festivalAnimationError}</p>
                  )}
                  <button
                    aria-expanded={isEditingSpecialItems}
                    className={styles.specialManageButton}
                    onClick={isEditingSpecialItems
                      ? () => setIsEditingSpecialItems(false)
                      : openSpecialItemsEditor}
                    type="button"
                  >
                    {isEditingSpecialItems ? TEXT.header.close : TEXT.header.manageSpecialItems}
                  </button>
                  {specialItemsError && !isEditingSpecialItems && (
                    <p className={styles.settingsError} role="alert">{specialItemsError}</p>
                  )}
                  {isEditingSpecialItems && (
                    <section aria-label={TEXT.header.specialEditorAria} className={styles.specialEditor}>
                      <p className={styles.specialEditorTitle}>{TEXT.header.chooseSpecialItems(MAX_SPECIAL_ITEMS)}</p>
                      <p className={styles.specialEditorCount}>{TEXT.header.selectedSpecialItems(specialItemsDraft.length, MAX_SPECIAL_ITEMS)}</p>
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
                      {specialItemsError && <p className={styles.settingsError} role="alert">{specialItemsError}</p>}
                      <div className={styles.specialEditorActions}>
                        <button
                          className={styles.specialCancel}
                          disabled={isSavingSpecialItems}
                          onClick={() => setIsEditingSpecialItems(false)}
                          type="button"
                        >
                          {TEXT.header.cancel}
                        </button>
                        <button
                          className={styles.specialSave}
                          disabled={isSavingSpecialItems}
                          onClick={saveSpecialItems}
                          type="button"
                        >
                          {isSavingSpecialItems ? TEXT.header.saving : TEXT.header.save}
                        </button>
                      </div>
                    </section>
                  )}
                </div>
              )}
            </Menu>
            {authError && <span role="alert" className="header-error header-session-error">{authError}</span>}
            {directionsError && <span role="alert" className="header-error header-session-error">{directionsError}</span>}
          </div>
        </div>
      </div>
      <div className="header-categories">
        <div className={`header-category-group ${styles.specialCategoryGroup}`}>
          <div className={styles.specialHeading}>
            <h3>{TEXT.header.specialItemsHeading}</h3>
          </div>
          <div className="header-category-links">
            {visibleSpecialItems.map((product) => (
              <Link className="snacks" href={`/${product.slug}`} key={product.slug}>
                {product.title.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
        <input
          type="text"
          spellCheck={false}
          placeholder={TEXT.header.searchPlaceholder}
          className="search-input header-category-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link
          aria-current={pathname === '/about' ? 'page' : undefined}
          className={`snacks ${styles.aboutLink}`}
          href="/about"
        >
          {TEXT.header.aboutUs}
          <HandshakeOutlinedIcon aria-hidden="true" className={styles.aboutIcon} />
        </Link>
      </div>
    </nav>
    {isProductDetailsPage && searchTerm.trim() && (
      <SearchProductsModal searchTerm={searchTerm} onClose={closeProductSearch} />
    )}
    </>
  )
}

export default Header