// components/SnackCards.tsx
'use client';

import { ArrowForward } from '@mui/icons-material';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useSearch } from './components/searchBar';
import FloatingCheckout from './components/floatingCheckout';
import AvailabilityToggle from './components/AvailabilityToggle';
import { MENU_PRODUCTS } from './config/products';
import FavoriteButton from './components/FavoriteButton';
import CartQuantityControl from './components/CartQuantityControl';
import { TEXT } from './constants';
import styles from './page.module.css';
import { LocalDiningOutlined, ArrowForwardRounded, FavoriteBorderRounded } from '@mui/icons-material';

const items = MENU_PRODUCTS;
const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const card: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  hover: { y: -3, scale: 1.015, boxShadow: '0 17px 36px rgba(57,69,47,0.14)' },
};

export default function SnackCards() {
  const { searchTerm } = useSearch();
  const safeSearch = searchTerm || "";

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(safeSearch.toLowerCase())
  );
  return (
    <main className={styles.home}>
      <section aria-labelledby="home-title" className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.heroEyebrow}>
            <LocalDiningOutlined aria-hidden="true" />
            {TEXT.home.eyebrow}
          </span>
          <h1 id="home-title">{TEXT.home.heading}</h1>
          <p>{TEXT.home.intro}</p>
          <div className={styles.heroActions}>
            <a className={styles.heroPrimary} href="#menu">
              {TEXT.home.exploreMenu}
              <ArrowForwardRounded aria-hidden="true" />
            </a>
            <Link className={styles.heroSecondary} href="/favorites">
              <FavoriteBorderRounded aria-hidden="true" />
              {TEXT.home.favoritesLink}
            </Link>
          </div>
        </div>
        <div aria-hidden="true" className={styles.heroArtwork}>
          <span className={styles.artHalo} />
          <span className={`${styles.foodTile} ${styles.foodTileOne}`}>🥞</span>
          <span className={`${styles.foodTile} ${styles.foodTileTwo}`}>🥣</span>
          <span className={`${styles.foodTile} ${styles.foodTileThree}`}>🌶️</span>
          <span className={styles.artBadge}>Lalitha<br />Home Foods</span>
        </div>
      </section>

      <section aria-labelledby="menu-heading" className={styles.menuSection} id="menu">
        <header className={styles.menuHeader}>
          <div>
            <p className={styles.sectionEyebrow}>{TEXT.home.eyebrow}</p>
            <h2 id="menu-heading">{TEXT.home.menuHeading}</h2>
            <p>{TEXT.home.menuDescription}</p>
          </div>
          <span className={styles.menuCount}>{filteredItems.length} items</span>
        </header>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className={styles.grid}
        >
          {filteredItems.map((item) => (
            <motion.article
              key={item.slug}
              variants={card}
              whileHover="hover"
              className={styles.card}
            >
              <div className={styles.imageWrap}>
                <FavoriteButton className="favorite-button--card" slug={item.slug} title={item.title} />
                <Image
                  src={item.img}
                  alt={item.title}
                  className={styles.image}
                  width={320}
                  height={180}
                  sizes="(max-width: 520px) 50vw, (max-width: 1050px) 33vw, 25vw"
                />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.productHeading}>
                  <h3 className={styles.title}>{item.title}</h3>
                </div>
                <p className={styles.tagline}>{item.tagline}</p>
                <AvailabilityToggle slug={item.slug} title={item.title} />
                <div className={styles.actions}>
                  <span className={styles.price}>{TEXT.money.symbol}{item.price}</span>
                  <div className={styles.quantityControl}>
                    <CartQuantityControl item={item} />
                  </div>
                  <Link aria-label={TEXT.home.productInfo(item.title)} className={styles.infoLink} href={`/${item.slug}`}>
                    <motion.span whileTap={{ scale: 0.94 }} className={styles.infoButton}>
                      <ArrowForward fontSize="small" />
                    </motion.span>
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
          {filteredItems.length === 0 && (
            <p className={styles.noResults}>No menu items match “{safeSearch}”.</p>
          )}
          <FloatingCheckout />
        </motion.div>
      </section>
    </main>
  );
}
