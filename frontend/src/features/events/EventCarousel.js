import * as Styled from './EventCarousel.styles';
import UserAttendanceSummary from './UserAttendanceSummary';
import EventLocation from './EventLocation';
import AttendanceList from './AttendanceList';

const EventCarousel = ({ event }) => {
  if (!event) {
    return null;
  }

  return (
    <Styled.CarouselContainer>
      <Styled.ContentCarousel headings={['Me', 'Lineup', 'Location']}>
        <Styled.ContentCarouselItem>
          <UserAttendanceSummary event={event} />
        </Styled.ContentCarouselItem>

        <Styled.ContentCarouselItem>
          <AttendanceList
            attendees={event.attendees}
            eventId={event.id}
            isFull={event.isFull}
          />
        </Styled.ContentCarouselItem>

        <Styled.ContentCarouselItem>
          <EventLocation event={event} />
        </Styled.ContentCarouselItem>
      </Styled.ContentCarousel>
    </Styled.CarouselContainer>
  );
};

export default EventCarousel;
