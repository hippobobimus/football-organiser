import { useSelector } from 'react-redux';

import * as Styled from './EventDetails.styles';
import EventInfo from './EventInfo';
import AttendanceList from './AttendanceList';
import { selectEventAttendees } from './eventsSlice';

const EventDetails = ({ eventId }) => {
  const attendees = useSelector((state) =>
    selectEventAttendees(state, eventId)
  );

  return (
    <Styled.ContentCarousel headings={['Info', 'Lineup', 'Weather']}>
      <Styled.ContentCarouselItem>
        <EventInfo eventId={eventId} />
      </Styled.ContentCarouselItem>

      <Styled.ContentCarouselItem>
        <AttendanceList attendanceRecords={attendees} />
      </Styled.ContentCarouselItem>

      <Styled.ContentCarouselItem>
        <div>Weather</div>
      </Styled.ContentCarouselItem>
    </Styled.ContentCarousel>
  );
};

export default EventDetails;
