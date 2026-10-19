export type Product = {
  slug: string;
  title: string;
  tagline: string;
  price: number;
  img: string;
};

export const PRODUCTS: Product[] = [
  { slug: 'dosa', title: 'Dosa', tagline: 'Golden crisp, airy bliss', price: 60, img: '/images/dosa.svg' },
  { slug: 'bonda', title: 'Bonda', tagline: 'Golden crunch, spicy punch', price: 40, img: '/images/bonda.svg' },
  { slug: 'bajji', title: 'Bajji', tagline: 'Crispy delight with every bite', price: 35, img: '/images/bajji.svg' },
  { slug: 'medu-vada', title: 'Medu Vada', tagline: 'Crispy outside, soft inside', price: 30, img: '/images/medu-vada.svg' },
  { slug: 'masala-vada', title: 'Masala Vada', tagline: 'Crunchy lentils with warm spices', price: 30, img: '/images/masala-vada.svg' },
  { slug: 'puri', title: 'Puri', tagline: 'Crisp puris topped with chutneys', price: 60, img: '/images/puri.svg' },
  { slug: 'idli', title: 'Idli', tagline: 'Soft steamed rice cakes', price: 40, img: '/images/idli.svg' },
  { slug: 'upma', title: 'Upma', tagline: 'Savory semolina delight', price: 50, img: '/images/upma.svg' },
  { slug: 'pesarattu', title: 'Pesarattu', tagline: 'Protein-rich green gram dosa', price: 65, img: '/images/pesarattu.svg' },
  { slug: 'samosa', title: 'Samosa', tagline: 'Crispy pastry with spiced filling', price: 30, img: '/images/samosa.svg' },
  { slug: 'pakora', title: 'Pakora', tagline: 'Golden fritters with crunch', price: 35, img: '/images/pakora.svg' },
  { slug: 'bhel-puri', title: 'Bhel Puri', tagline: 'Tangy puffed rice mix', price: 45, img: '/images/bhel-puri.svg' },
  { slug: 'sev-puri', title: 'Sev Puri', tagline: 'Crisp puris with chutneys & sev', price: 55, img: '/images/sev-puri.svg' },
  { slug: 'pav-bhaji', title: 'Pav Bhaji', tagline: 'Buttery bread with spicy mash', price: 80, img: '/images/pav-bhaji.svg' },
  { slug: 'jalebi', title: 'Jalebi', tagline: 'Sweet golden spirals', price: 50, img: '/images/jalebi.svg' },
  { slug: 'vada', title: 'Vada', tagline: 'Crispy savory vada', price: 30, img: '/images/vada.svg' },
];

export const PRODUCTS_BY_SLUG: Record<string, Product> = Object.fromEntries(
  PRODUCTS.map((product) => [product.slug, product]),
);

export const MENU_PRODUCTS = PRODUCTS.filter((product) => product.slug !== 'vada');
