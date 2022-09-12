import { useParams } from 'react-router-dom';

import { Section } from '../../../components/styles';
import { PageContainer } from '../../../components/Container';
import { useGetEventQuery } from '../api/eventsApiSlice';

export const EventLocation = () => {
  const { eventId } = useParams();
  const { data: event } = useGetEventQuery(eventId);

  if (!event) {
    return null;
  }

  const { location } = event;

  return (
    <PageContainer>
      <Section>
        <p>{location.name}</p>
        <p>{location.line1}</p>
        <p>{location.line2}</p>
        <p>{location.town}</p>
        <p>{location.postcode}</p>
      </Section>
    </PageContainer>
  );
};
