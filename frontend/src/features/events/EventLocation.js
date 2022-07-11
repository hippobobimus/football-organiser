import { Section } from '../../components/styles';

const EventLocation = ({ event }) => {
  if (!event) {
    return null;
  }

  const { location } = event;

  return (
    <Section>
      <p>{location.name}</p>
      <p>{location.line1}</p>
      <p>{location.line2}</p>
      <p>{location.town}</p>
      <p>{location.postcode}</p>
    </Section>
  );
};

export default EventLocation;
