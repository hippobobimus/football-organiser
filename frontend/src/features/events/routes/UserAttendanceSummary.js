import { useParams } from 'react-router-dom';

import { SmallButton, Button } from '../../../components/styles';
import * as Styled from './UserAttendanceSummary.styles';
import {
  useUpdateAuthUserEventAttendeeMutation,
  useRemoveAuthUserFromEventMutation,
  useAddAuthUserToEventMutation,
  useGetEventQuery,
} from '../api/eventsApiSlice';

export const UserAttendanceSummary = () => {
  const { eventId } = useParams();

  const [updateAuthUserEventAttendee] =
    useUpdateAuthUserEventAttendeeMutation();
  const [removeAuthUserFromEvent] = useRemoveAuthUserFromEventMutation();
  const [addAuthUserToEvent] = useAddAuthUserToEventMutation();
  const { data: event } = useGetEventQuery(eventId);

  if (
    !event ||
    event.isCancelled ||
    (event.isFinished && !event.authUserAttendee)
  ) {
    return null;
  }

  const guests = event.authUserAttendee?.guests;

  if (event.isFinished) {
    return (
      <Styled.SummaryContainer>
        <Styled.Status>
          {event.category === 'match' ? 'You Played!' : 'You Attended!'}
        </Styled.Status>
        {guests > 0 && (
          <Styled.GuestsContainer>
            <p>
              ...and brought{' '}
              <u>
                <b>{guests} guest(s)</b>
              </u>
            </p>
          </Styled.GuestsContainer>
        )}
      </Styled.SummaryContainer>
    );
  }

  const handleJoin = () => {
    addAuthUserToEvent(eventId);
  };

  if (!event.authUserAttendee) {
    return (
      <Styled.SummaryContainer>
        <Button type="button" onClick={handleJoin}>
          Count Me In!
        </Button>
      </Styled.SummaryContainer>
    );
  }

  const handleLeave = () => {
    removeAuthUserFromEvent(eventId);
  };

  const handleAddGuest = () => {
    updateAuthUserEventAttendee({
      eventId,
      guests: guests + 1,
    });
  };

  const handleRemoveGuest = () => {
    updateAuthUserEventAttendee({
      eventId,
      guests: guests - 1,
    });
  };

  return (
    <Styled.SummaryContainer>
      <Styled.Status>
        {event.category === 'match' ? "You're Playing!" : "You're Attending!"}
      </Styled.Status>
      {guests > 0 ? (
        <Styled.GuestsContainer>
          <p>
            ...and bringing{' '}
            <u>
              <b>{guests} guest(s)</b>
            </u>
          </p>
          <SmallButton
            type="button"
            onClick={handleRemoveGuest}
            disabled={guests === 0}
          >
            -
          </SmallButton>
          <SmallButton
            type="button"
            onClick={handleAddGuest}
            disabled={event.isFull}
          >
            +
          </SmallButton>
        </Styled.GuestsContainer>
      ) : (
        <SmallButton
          type="button"
          onClick={handleAddGuest}
          disabled={event.isFull}
        >
          Add a Guest
        </SmallButton>
      )}
      <SmallButton type="button" onClick={handleLeave}>
        Cancel my attendance
      </SmallButton>
    </Styled.SummaryContainer>
  );
};
