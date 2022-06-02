import { Subtitle } from '../../components/styles';
import * as Styled from './EventView.styles';
import EventCarousel from './EventCarousel';
import UserAttendanceSummary from './UserAttendanceSummary';

const EventView = ({eventDetails}) => {
  return (
    <Styled.ContentContainer>
      <Subtitle>{eventDetails?.name}</Subtitle>
      <UserAttendanceSummary
        event={eventDetails}
      />
      <EventCarousel
        event={eventDetails}
      />
    </Styled.ContentContainer>
  );
};

export default EventView;
