import VadaProduct from '../components/VadaProduct';

export default function MasalaVadaPage() {
  return (
    <VadaProduct
      slug="masala-vada"
      title="Masala Vada"
      image="/images/masala-vada.svg"
      description="Masala vada is a crunchy South Indian lentil fritter made with coarsely ground chana dal and aromatic spices."
      details={[
        'A crisp, flat patty with a hearty lentil texture.',
        'Seasoned with onion, curry leaves, ginger, and green chili.',
        'Enjoyed hot as a tea-time snack or alongside chutney.',
      ]}
    />
  );
}
