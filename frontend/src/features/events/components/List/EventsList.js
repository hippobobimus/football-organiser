import { SectionHeading } from '../../../../components/styles';
import { EventListItem } from './EventListItem';
import * as Styled from './EventsList.styles';

export const EventsList = ({ events }) => {
  if (!events?.length) {
    return <SectionHeading>No events found...</SectionHeading>;
  }

  return (
    <Styled.List>
      {events.map((event) => (
        <EventListItem key={event.id} event={event} />
      ))}
    </Styled.List>
  );
};
