import * as Styled from './EventDetails.styles';
import EventInfo from './EventInfo';
import AttendanceList from './AttendanceList';

const EventDetails = ({ event, location, attendees }) => {
  return (
    <Styled.ContentCarousel headings={['Info', 'Lineup', 'Weather']}>
      <Styled.ContentCarouselItem>
        <EventInfo event={event} location={location} />
      </Styled.ContentCarouselItem>

      <Styled.ContentCarouselItem>
        <AttendanceList attendees={attendees} />
      </Styled.ContentCarouselItem>

      <Styled.ContentCarouselItem>
        <div>Weather</div>
      </Styled.ContentCarouselItem>
    </Styled.ContentCarousel>
  );
};

export default EventDetails;
