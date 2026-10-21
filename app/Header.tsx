'use client';
import Link from 'next/link'
import Image from 'next/image';
import "./globals.css";
import { usePathname, useRouter } from 'next/navigation';
import { Button, Menu, MenuItem } from '@mui/material';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect, useState } from 'react';
import { useCart } from './context/CartContext';
import { useAvailability } from './context/AvailabilityContext';
import { useSearch } from './components/searchBar';

function Header() { 
const router = useRouter();
const pathname = usePathname();
const { setSearchTerm } = useSearch();
const { cartCount } = useCart();
const { isManagingAvailability, toggleAvailabilityManagement, availabilityError } = useAvailability();
const [isSignedIn, setIsSignedIn] = useState(false);
const [isShopkeeper, setIsShopkeeper] = useState(false);
const [userName, setUserName] = useState('');
const [userEmail, setUserEmail] = useState('');
const [userPhone, setUserPhone] = useState('');
const [authError, setAuthError] = useState('');
const [accountMenuAnchor, setAccountMenuAnchor] = useState<HTMLElement | null>(null);

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

  return (
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
            <span>WELCOME TO</span>
            <span>LALITHA FOODS</span>
          </div>
        </div>
        <div className="header-actions">
          {isShopkeeper && (
            <div className="header-search-tools">
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
          )}
          {availabilityError && <span role="alert" className="header-error">{availabilityError}</span>}
          <Badge badgeContent={cartCount} color="secondary">
            <ShoppingCartIcon
              aria-label="Shopping cart"
              onClick={() => router.push('/cart')}
              style={{ fontSize: 28, cursor: 'pointer', color: '#FFD54F' }}
            />
          </Badge>
          <Button
            sx={{ borderRadius: 3, fontWeight: 'bold' }}
            onClick={handleAccountButton}
            className="header-action-button"
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
            sx={{ minWidth: 40, padding: '6px', color: 'white' }}
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
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="header-category-group">
          <h3>ORDER SPECIAL ITEMS :</h3>
          <div className="header-category-links">
            <Link className="snacks" href="/dosa">DOSA</Link>
            <Link className="snacks" href="/bonda">BONDA</Link>
            <Link className="snacks" href="/bajji">BAJJI</Link>
            <Link className="snacks" href="/vada">VADA</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header