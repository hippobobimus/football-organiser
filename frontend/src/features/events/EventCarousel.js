import * as Styled from './EventCarousel.styles';
import UserAttendanceSummary from './UserAttendanceSummary';
import EventLocation from './EventLocation';
import AttendanceList from './AttendanceList';

const EventCarousel = ({ event }) => {
  return (
    <Styled.CarouselContainer>
      <Styled.ContentCarousel
        headings={['Me', 'Lineup', 'Location', 'Weather']}
      >
        <Styled.ContentCarouselItem>
          <UserAttendanceSummary event={event} />
        </Styled.ContentCarouselItem>

        <Styled.ContentCarouselItem>
          <AttendanceList
            attendees={event.attendees}
            isFull={event.isFull}
          />
        </Styled.ContentCarouselItem>

        <Styled.ContentCarouselItem>
          <EventLocation event={event} />
        </Styled.ContentCarouselItem>

        <Styled.ContentCarouselItem>
          <div>Weather</div>
        </Styled.ContentCarouselItem>
      </Styled.ContentCarousel>
    </Styled.CarouselContainer>
  );
};

export default EventCarousel;
