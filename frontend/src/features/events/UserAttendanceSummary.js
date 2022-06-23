import { useDispatch } from 'react-redux';

import { SmallButton, Button } from '../../components/styles';
import * as Styled from './UserAttendanceSummary.styles';
import {
  addAuthUserToEvent,
  removeAuthUserFromEvent,
  updateAuthUserEventAttendee,
} from './eventsSlice';

const UserAttendanceSummary = ({ event }) => {
  const dispatch = useDispatch();

  if (!event || event.isCancelled || (event.isFinished && !event.authUserAttendee)) {
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
    dispatch(addAuthUserToEvent(event.id));
  };

  if (!event.authUserAttendee) {
    return (
      <Styled.SummaryContainer>
        <Button type='button' onClick={handleJoin}>
          Count Me In!
        </Button>
      </Styled.SummaryContainer>
    );
  }

  const handleLeave = () => {
    dispatch(removeAuthUserFromEvent(event.id));
  };

  const handleAddGuest = () => {
    dispatch(
      updateAuthUserEventAttendee({
        eventId: event.id,
        guests: guests + 1,
      })
    );
  };

  const handleRemoveGuest = () => {
    if (guests > 0) {
      dispatch(
        updateAuthUserEventAttendee({
          eventId: event.id,
          guests: guests - 1,
        })
      );
    }
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
          <SmallButton type='button' onClick={handleRemoveGuest}>
            -
          </SmallButton>
          <SmallButton type='button' onClick={handleAddGuest} disabled={event.isFull}>
            +
          </SmallButton>
        </Styled.GuestsContainer>
      ) : (
        <SmallButton type='button' onClick={handleAddGuest} disabled={event.isFull}>
          Add a Guest
        </SmallButton>
      )}
      <SmallButton type='button' onClick={handleLeave}>
        Cancel my attendance
      </SmallButton>
    </Styled.SummaryContainer>
  );
};

export default UserAttendanceSummary;
