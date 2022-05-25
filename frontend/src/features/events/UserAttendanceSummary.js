import { useDispatch } from 'react-redux';

import { SmallButton, Button } from '../../components/styles';
import * as Styled from './UserAttendanceSummary.styles';
import { joinEvent, leaveEvent } from './attendees/attendeesSlice';

const UserAttendanceSummary = ({ attendeeDetails, eventId }) => {
  const dispatch = useDispatch();

  if (!eventId) {
    return <p>Error: No event</p>;
  }

  const handleJoin = () => {
    dispatch(joinEvent(eventId));
  };

  const handleLeave = () => {
    dispatch(leaveEvent(eventId));
  };

  return (
    <Styled.SummaryContainer>
      {attendeeDetails ? (
        <>
          <Styled.Status>You're Playing!</Styled.Status>
          {attendeeDetails?.guests ? (
            <Styled.GuestsContainer>
              <p>
                ...and bringing{' '}
                <u>
                  <b>{attendeeDetails.guests} guest(s)</b>
                </u>
              </p>
              <SmallButton>-</SmallButton>
              <SmallButton>+</SmallButton>
            </Styled.GuestsContainer>
          ) : (
            <SmallButton>Add a Guest</SmallButton>
          )}
        <SmallButton type='button' onClick={handleLeave}>Cancel my attendance</SmallButton>
        </>
      ) : (
        <Button type='button' onClick={handleJoin}>Count Me In!</Button>
      )}
    </Styled.SummaryContainer>
  );
};

export default UserAttendanceSummary;
