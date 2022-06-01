import { Subtitle } from '../../components/styles';
import * as Styled from './EventView.styles';
import EventCarousel from './EventCarousel';
import UserAttendanceSummary from './UserAttendanceSummary';

const EventView = ({eventDetails}) => {
  // TODO dummy data
  const location = {
    name: 'Powerleague Watford',
    number: '',
    street: 'Aldenham Road',
    city: 'Watford',
    postcode: 'WD23 2TY',
  };

  return (
    <Styled.ContentContainer>
      <Subtitle>{eventDetails?.name}</Subtitle>
      <UserAttendanceSummary
        event={eventDetails}
      />
      <EventCarousel
        event={eventDetails}
        location={location}
      />
    </Styled.ContentContainer>
  );
};

export default EventView;
