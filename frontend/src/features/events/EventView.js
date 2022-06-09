import { SmallButton, ButtonRow, Subtitle } from '../../components/styles';
import * as Styled from './EventView.styles';
import EventInfoBar from './EventInfoBar';
import EventCarousel from './EventCarousel';

const EventView = ({ event, onCancel, onUncancel, onDelete }) => {
  return (
    <Styled.ContentContainer>
      <Subtitle>{event?.name}</Subtitle>
      <EventInfoBar event={event} />
      <EventCarousel event={event} />
      <ButtonRow>
        <SmallButton type='button' onClick={() => null}>
          Edit
        </SmallButton>
        {event.isCancelled ? (
          <SmallButton type='button' onClick={onUncancel}>
            Uncancel
          </SmallButton>
        ) : (
          <SmallButton type='button' onClick={onCancel}>
            Cancel
          </SmallButton>
        )}
        <SmallButton type='button' onClick={onDelete}>
          Delete
        </SmallButton>
      </ButtonRow>
    </Styled.ContentContainer>
  );
};

export default EventView;
