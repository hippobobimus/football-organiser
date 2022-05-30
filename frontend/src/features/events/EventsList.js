import EventListItem from './EventListItem';
import * as Styled from './EventsList.styles';

const EventsList = ({ events }) => {
  return (
    <Styled.List>
      {events.map((event) => (
        <EventListItem event={event} />
      ))}
    </Styled.List>
  );
};

export default EventsList;
