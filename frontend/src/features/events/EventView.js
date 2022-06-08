import { SmallButton, ButtonRow, Subtitle } from '../../components/styles';
import * as Styled from './EventView.styles';
import EventCarousel from './EventCarousel';
import UserAttendanceSummary from './UserAttendanceSummary';

const EventView = ({ event, onCancel, onUncancel, onDelete }) => {
  return (
    <Styled.ContentContainer>
      <Subtitle>{event?.name}</Subtitle>
      <Styled.Status>
        {(event.isCancelled && 'Cancelled') ||
          (event.isFinished && 'Finished') ||
          (event.isFull && 'Event Full')}
      </Styled.Status>
      <ButtonRow>
        {event.isCancelled ? (
          <SmallButton type='button' onClick={onUncancel}>
            Uncancel Event
          </SmallButton>
        ) : (
          <SmallButton type='button' onClick={onCancel}>
            Cancel Event
          </SmallButton>
        )}
        <SmallButton type='button' onClick={onDelete}>
          Delete Event
        </SmallButton>
      </ButtonRow>
      <UserAttendanceSummary event={event} />
      <EventCarousel event={event} />
    </Styled.ContentContainer>
  );
};

export default EventView;
