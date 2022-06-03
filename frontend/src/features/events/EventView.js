import { Subtitle } from '../../components/styles';
import * as Styled from './EventView.styles';
import EventCarousel from './EventCarousel';
import UserAttendanceSummary from './UserAttendanceSummary';

const EventView = ({ event }) => {
  return (
    <Styled.ContentContainer>
      <Subtitle>{event?.name}</Subtitle>
      <UserAttendanceSummary event={event} />
      <EventCarousel event={event} />
    </Styled.ContentContainer>
  );
};

export default EventView;
