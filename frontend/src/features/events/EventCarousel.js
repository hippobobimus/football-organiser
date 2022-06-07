import * as Styled from './EventCarousel.styles';
import EventInfo from './EventInfo';
import AttendanceList from './AttendanceList';

const EventCarousel = ({ event }) => {
  return (
    <Styled.ContentCarousel headings={['Info', 'Lineup', 'Weather']}>
      <Styled.ContentCarouselItem>
        <EventInfo event={event} />
      </Styled.ContentCarouselItem>

      <Styled.ContentCarouselItem>
        <AttendanceList
          attendees={event.attendees}
          isFull={event.isFull}
          capacity={event.capacity}
        />
      </Styled.ContentCarouselItem>

      <Styled.ContentCarouselItem>
        <div>Weather</div>
      </Styled.ContentCarouselItem>
    </Styled.ContentCarousel>
  );
};

export default EventCarousel;
