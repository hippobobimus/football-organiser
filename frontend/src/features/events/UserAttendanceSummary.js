import { useDispatch } from 'react-redux';

import { SmallButton, Button } from '../../components/styles';
import * as Styled from './UserAttendanceSummary.styles';
import {
  addAuthUserToEvent,
  removeAuthUserFromEvent,
  updateAuthUserEventAttendee,
} from './attendees/attendeesSlice';

const UserAttendanceSummary = ({ attendeeDetails, eventId }) => {
  const dispatch = useDispatch();

  if (!eventId) {
    return (
      <Styled.SummaryContainer>
        <p>Error: No event</p>
      </Styled.SummaryContainer>
    );
  }

  const handleJoin = () => {
    dispatch(addAuthUserToEvent(eventId));
  };

  if (!attendeeDetails) {
    return (
      <Styled.SummaryContainer>
        <Button type='button' onClick={handleJoin}>
          Count Me In!
        </Button>
      </Styled.SummaryContainer>
    );
  }

  const { guests } = attendeeDetails;

  const handleLeave = () => {
    dispatch(removeAuthUserFromEvent(eventId));
  };

  const handleAddGuest = () => {
    dispatch(
      updateAuthUserEventAttendee({
        eventId,
        guests: guests + 1,
      })
    );
  };

  const handleRemoveGuest = () => {
    if (guests > 0) {
      dispatch(
        updateAuthUserEventAttendee({
          eventId,
          guests: guests - 1,
        })
      );
    }
  };

  return (
    <Styled.SummaryContainer>
      <Styled.Status>You're Playing!</Styled.Status>
      {guests ? (
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
          <SmallButton type='button' onClick={handleAddGuest}>
            +
          </SmallButton>
        </Styled.GuestsContainer>
      ) : (
        <SmallButton type='button' onClick={handleAddGuest}>
          I'm Bringing a Guest
        </SmallButton>
      )}
      <SmallButton type='button' onClick={handleLeave}>
        Cancel my attendance
      </SmallButton>
    </Styled.SummaryContainer>
  );
};

export default UserAttendanceSummary;
