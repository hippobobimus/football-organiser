import * as Styled from './styles';
import { EventInfoList } from './EventInfoList';
import { EventStatus } from './EventStatus';

export const EventInfoBar = ({ eventId }) => {
  return (
    <Styled.InfoContainer>
      <EventStatus eventId={eventId} />
      <EventInfoList eventId={eventId} />
    </Styled.InfoContainer>
  );
};
