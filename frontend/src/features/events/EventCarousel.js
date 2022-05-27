import * as Styled from './EventCarousel.styles';
import EventInfo from './EventInfo';
import AttendanceList from './AttendanceList';

const EventCarousel = ({ eventDetails, location, attendees }) => {
  return (
    <Styled.ContentCarousel headings={['Info', 'Lineup', 'Weather']}>
      <Styled.ContentCarouselItem>
        <EventInfo event={eventDetails} location={location} />
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

export default EventCarousel;
