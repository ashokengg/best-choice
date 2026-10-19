'use client';
import Link from 'next/link'
import Image from 'next/image';
import "./globals.css";
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useEffect, useRef, useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useCart } from './context/CartContext';
import { useAvailability } from './context/AvailabilityContext';
import { useSearch } from './components/searchBar';


const areas = [
  "Kanupuru",
  "Kasumuru",
  "Venkatachalam",
  "Kandalapadu",
  "Kuricharlapadu",
  "Chintalapalam",
  "Chowtapalam"
];
function Header() { 
const router = useRouter();
const pathname = usePathname();
const { setSearchTerm } = useSearch();
const { cartCount } = useCart();
const { isManagingAvailability, toggleAvailabilityManagement, availabilityError } = useAvailability();
const [isSignedIn, setIsSignedIn] = useState(false);
const [userName, setUserName] = useState('');
const [authError, setAuthError] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const hoverTimeout = useRef<number | null>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    let active = true;
    fetch('/api/auth/me')
      .then(async (response) => {
        if (response.status === 401) {
            if (active) {
              setIsSignedIn(false);
              setUserName('');
            }
            return;
          }
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || 'Could not check your account.');
          if (active) {
            setIsSignedIn(true);
            setUserName(typeof result.user?.name === 'string' ? result.user.name : '');
          }
      })
      .catch((error: unknown) => {
        console.error('Could not check signed-in status.', error);
        if (active) setAuthError('Account status is unavailable.');
      });
    return () => { active = false; };
  }, [pathname]);

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
      setUserName('');
      router.push('/login');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Could not log out.');
    }
  };

  const clearCloseTimeout = () => {
    if (hoverTimeout.current) {
      window.clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
  };

  const handleButtonEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    clearCloseTimeout();
    setAnchorEl(e.currentTarget);
  };

  const handleButtonLeave = () => {
    // Delay close so user can move into the menu
    clearCloseTimeout();
    hoverTimeout.current = window.setTimeout(() => setAnchorEl(null), 120);
  };

  const handleMenuEnter = () => {
    clearCloseTimeout();
  };

  const handleMenuLeave = () => {
    // Close when leaving the menu area
    clearCloseTimeout();
    hoverTimeout.current = window.setTimeout(() => setAnchorEl(null), 120);
  };

  const handleSelect = (slug: string) => {
    setAnchorEl(null);
    router.push(`/${slug.toLowerCase()}`);
  };

  const handleManageItemsClick = () => {
    if (!isManagingAvailability && window.location.pathname !== '/') {
      router.push('/');
    }
    toggleAvailabilityManagement();
  };

  return (
    <nav className="header">
      <div className="header-main">
        <div className="header-brand">
          <div className="header-logo-group">
            <Link href="/" className="header-logo-link" aria-label="TiffinNest home">
              <Image
                src="/images/Tiffin%20Nest.svg.png"
                alt="TiffinNest — Good Food. Closer to You."
                width={440}
                height={220}
                quality={100}
                sizes="(max-width: 560px) 130px, 150px"
                priority
                className="header-logo"
              />
            </Link>
            <span className="header-welcome">Welcome to Lalitha Food&apos;s</span>
          </div>
          <button className="header-home" onClick={() => router.push('/')}>HOME</button>
          <Button
            aria-label="Choose delivery area"
            onMouseEnter={handleButtonEnter}
            onMouseLeave={handleButtonLeave}
            className="header-location"
          >
            <LocationOnIcon />
          </Button>
        </div>
        <div className="header-actions">
          <div className="header-search-tools">
            <input
              type="text"
              spellCheck={false}
              placeholder="Search items..."
              className="search-input"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          <Button
            type="button"
            aria-pressed={isManagingAvailability}
            onClick={handleManageItemsClick}
            sx={{
              borderRadius: 2,
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              color: 'white',
              backgroundColor: isManagingAvailability ? '#6b2d7b' : 'rgba(255,255,255,0.12)',
              '&:hover': { backgroundColor: isManagingAvailability ? '#7d368f' : 'rgba(255,255,255,0.2)' },
            }}
          >
            {isManagingAvailability ? 'Done' : 'Manage Items'}
          </Button>
          </div>
          {availabilityError && <span role="alert" className="header-error">{availabilityError}</span>}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            className="dropdown"
            MenuListProps={{
              onMouseEnter: handleMenuEnter,
              onMouseLeave: handleMenuLeave,
              sx: { py: 0.5 },
            }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            keepMounted
          >
            {areas.map((area) => (
              <MenuItem
                key={area}
                onClick={() => handleSelect(area)}
                className="dropdown-content"
                sx={{
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 4,
                    width: 0,
                    height: '2px',
                    backgroundColor: 'orange',
                    transition: 'width 0.3s ease',
                  },
                  '&:hover::after': { width: '100%' },
                }}
              >
                {area}
              </MenuItem>
            ))}
          </Menu>
          <Badge badgeContent={cartCount} color="secondary">
            <ShoppingCartIcon
              aria-label="Shopping cart"
              onClick={() => router.push('/cart')}
              style={{ fontSize: 28, cursor: 'pointer', color: '#FFD54F' }}
            />
          </Badge>
          <Button
            sx={{ borderRadius: 3, fontWeight: 'bold' }}
            onClick={() => router.push('/orders')}
            className="header-action-button">
            MY ORDERS
          </Button>
          {isSignedIn && userName && (
            <span className="header-user-name">Hi, {userName}</span>
          )}
          <Button
            sx={{ borderRadius: 3, fontWeight: 'bold' }}
            onClick={handleAccountButton}
            className="header-action-button"
          >
            {isSignedIn ? 'LOGOUT' : 'LOGIN'}
          </Button>
          {authError && <span role="alert" className="header-error">{authError}</span>}
        </div>
      </div>
      <div className="header-categories">
        <h3>ORDER BELOW SPECIAL ITEMS</h3>
        <div className="header-category-links">
          <Link className="snacks" href="/dosa">DOSA</Link>
          <Link className="snacks" href="/bonda">BONDA</Link>
          <Link className="snacks" href="/bajji">BAJJI</Link>
          <Link className="snacks" href="/vada">VADA</Link>
        </div>
      </div>
    </nav>
  )
}

export default Header