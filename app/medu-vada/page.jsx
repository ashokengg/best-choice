import VadaProduct from '../components/VadaProduct';

export default function MeduVadaPage() {
  return (
    <VadaProduct
      slug="medu-vada"
      title="Medu Vada"
      image="/images/medu-vada.svg"
      description="Medu vada is a savory South Indian fritter made from ground urad dal, shaped into a ring, and fried until golden."
      details={[
        'Crisp on the outside and soft in the center.',
        'Traditionally seasoned with curry leaves, pepper, and green chili.',
        'Served hot with coconut chutney and sambar.',
      ]}
    />
  );
}
