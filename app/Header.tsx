'use client';
import Link from 'next/link'
import "./globals.css";
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Badge, { badgeClasses } from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useState,useRef } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useCart } from './context/CartContext';
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
const { setSearchTerm } = useSearch();
const { cartCount } = useCart();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const hoverTimeout = useRef<number | null>(null);
  const open = Boolean(anchorEl);

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
  return (
    <nav style={{height:'60px',zIndex:'1',background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(12px)'}} className='header'>
        <div>
          <span style={{marginLeft:'20px',padding:'10px 20px',marginRight:'20px',fontWeight:'bold',color:'#FFD54F'}}>WELCOME TO BEST CHOICE</span>
          <button onClick={() => router.push('/')} style={{ backgroundColor: "",cursor:'pointer', color: "white", padding: "5px 10px", borderRadius: "5px" }}>HOME</button>
          <Button
        onMouseEnter={handleButtonEnter}
        onMouseLeave={handleButtonLeave}
        style={{
            backgroundColor: "",
            color: "white",
            fontSize: "17px",
            borderRadius: "5px",
          }}
      >
        <LocationOnIcon style={{ color: '#FFD54F',cursor:'pointer' }} />
      </Button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
          <div>
            <input
        type="text"
        spellCheck={false} 
        placeholder="Search items..."
        className='search-input'
        onChange={(e) => setSearchTerm(e.target.value)}
      />
          </div>
          <div>
            <h3 style={{color:'#FFD54F',letterSpacing:'3px',marginLeft:'20px'}}>ORDER BELOW SPECIAL ITEMS</h3>
            <h3 style={{gap:'10px',display:'flex',color:' whitesmoke',letterSpacing:'0px',marginLeft:'10px'}}>
                    <Link className='snacks' href="/dosa" style={{background:'',padding:'2px 10px 1px 10px',borderRadius: '15px'}}>DOSA</Link>
                    <Link className='snacks' href="/bonda"  style={{padding:'2px 10px 1px 10px',borderRadius: '15px'}}>BONDA</Link> 
                    <Link className='snacks' href="/bajji" style={{padding:'2px 10px 1px 10px',borderRadius: '15px'}}>BAJJI</Link>
                    <Link className='snacks' href="/vada" style={{padding:'2px 10px 1px 10px',borderRadius: '15px'}}>VADA</Link>
                    <Link className='snacks' href="/puri" style={{padding:'2px 10px 1px 10px',borderRadius: '15px'}}>PURI</Link>
            </h3>
          </div>
          <div style={{ display: 'inline-block' }}>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        className='dropdown'
        // Keep open while hovering the menu
        MenuListProps={{
          onMouseEnter: handleMenuEnter,
          onMouseLeave: handleMenuLeave,
          sx: { py: 0.5 },
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        // Improves UX in Next.js App Router
        keepMounted
        
      >
        {areas.map((area) => (
          <MenuItem
            key={area}
            style={{width:'200px'}}
            onClick={() => handleSelect(area)}
            className='dropdown-content'
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
    '&:hover::after': {
      width: '100%',
    },
  }}
          >
            {area}
          </MenuItem>
        ))}
      </Menu>
    </div>
          <Badge badgeContent={cartCount} color="secondary">
      <ShoppingCartIcon onClick={() => router.push('/cart')} style={{ fontSize: 28, cursor: 'pointer',color:'#FFD54F' }} />
    </Badge>
          <Button
            sx={{ borderRadius: 3, fontWeight: 'bold' }}
            onClick={() => router.push('/login')}
            style={{
            backgroundColor: "",
            color: "white",
            padding: "4px 8px",
            borderRadius: "5px",
          }}>
            LOGIN
          </Button>
        </div>
    </nav>
  )
}

export default Header