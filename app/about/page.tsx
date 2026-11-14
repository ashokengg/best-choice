import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import FavoriteBorderRounded from '@mui/icons-material/FavoriteBorderRounded';
import LocalDiningOutlined from '@mui/icons-material/LocalDiningOutlined';
import RestaurantMenuRounded from '@mui/icons-material/RestaurantMenuRounded';
import SpaOutlined from '@mui/icons-material/SpaOutlined';
import VolunteerActivismOutlined from '@mui/icons-material/VolunteerActivismOutlined';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About Us | Lalitha Home Foods',
  description: 'Meet Lalitha Home Foods and discover the care behind our homemade favourites.',
};

const values = [
  {
    icon: <LocalDiningOutlined aria-hidden="true" />,
    title: 'Comfort in every bite',
    description: 'Familiar favourites, made to bring a little warmth to your everyday table.',
  },
  {
    icon: <SpaOutlined aria-hidden="true" />,
    title: 'Rooted in home cooking',
    description: 'Inspired by the flavours, traditions, and generous spirit of an Indian kitchen.',
  },
  {
    icon: <VolunteerActivismOutlined aria-hidden="true" />,
    title: 'Made with care',
    description: 'We believe the small details—from preparation to your first bite—matter.',
  },
];

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <section aria-labelledby="about-title" className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>
            <RestaurantMenuRounded aria-hidden="true" />
            A little about our kitchen
          </span>
          <h1 id="about-title">Good food feels like <em>home.</em></h1>
          <p>
            Lalitha Home Foods brings the warmth of homemade favourites to your everyday.
            Rooted in familiar flavours and made for sharing, our menu is a celebration of
            the food that brings us together.
          </p>
          <Link className={styles.primaryLink} href="/#menu">
            Explore our menu
            <ArrowForwardRounded aria-hidden="true" />
          </Link>
        </div>
        <div className={styles.heroImage}>
          <Image
            alt="Illustration of a woman preparing a home-cooked meal in her kitchen"
            className={styles.cookingImage}
            fill
            priority
            sizes="(max-width: 760px) 100vw, 48vw"
            src="/images/about-home-cooking.svg"
          />
          <span className={styles.imageCaption}>
            <span className={styles.captionIcon}><FavoriteBorderRounded aria-hidden="true" /></span>
            From our kitchen, with care
          </span>
        </div>
      </section>

      <section aria-labelledby="story-title" className={styles.story}>
        <div className={styles.storyAccent} aria-hidden="true">
          <span>Made for</span>
          <strong>sharing</strong>
          <span>and savouring</span>
        </div>
        <div className={styles.storyCopy}>
          <p className={styles.sectionLabel}>OUR STORY</p>
          <h2 id="story-title">The best meals make you feel at home.</h2>
          <p>
            Some of our happiest moments happen around food: a favourite snack after a long
            day, a plate passed around the table, or a recipe that tastes just like you
            remember. That feeling is at the heart of Lalitha Home Foods.
          </p>
          <p>
            We bring together much-loved South Indian comfort foods and everyday favourites
            so there is always something delicious to discover, enjoy, and share.
          </p>
        </div>
      </section>

      <section aria-labelledby="values-title" className={styles.valuesSection}>
        <header className={styles.sectionHeader}>
          <p className={styles.sectionLabel}>WHAT MATTERS TO US</p>
          <h2 id="values-title">A little care goes a long way.</h2>
          <p>It is the simple things that make food memorable.</p>
        </header>
        <div className={styles.valuesGrid}>
          {values.map((value, index) => (
            <article className={styles.valueCard} key={value.title}>
              <span className={`${styles.valueIcon} ${styles[`valueIcon${index + 1}`]}`}>
                {value.icon}
              </span>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.closing}>
        <div>
          <p className={styles.sectionLabel}>COME ON IN</p>
          <h2>There is always room for one more favourite.</h2>
        </div>
        <Link className={styles.closingLink} href="/#menu">
          Find your favourite
          <ArrowForwardRounded aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
