import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { SmallButton, Button } from '../../components/styles';
import * as Styled from './UserAttendanceSummary.styles';
import { selectEventAttendees } from './eventsSlice';

const UserAttendanceSummary = ({ userId, eventId }) => {
  const [isAttending, setIsAttending] = useState(false);
  const [guests, setGuests] = useState(0);

  const attendees = useSelector((state) =>
    selectEventAttendees(state, eventId)
  );

  useEffect(() => {
    const found = attendees?.find(({ user }) => {
      // may or may not be populated.
      const attendeeUserId = user?.id || user;
      return attendeeUserId === userId;
    });

    if (found) {
      setIsAttending(true);
      setGuests(found.guests || 0);
    } else {
      setIsAttending(false);
      setGuests(0);
    }
  }, [attendees, userId]);

  return (
    <Styled.SummaryContainer>
      {isAttending ? (
        <>
          <Styled.Status>You're Playing!</Styled.Status>
          {guests ? (
            <Styled.GuestsContainer>
              <p>
                ...and bringing{' '}
                <u>
                  <b>{guests} guest(s)</b>
                </u>
              </p>
              <SmallButton>-</SmallButton>
              <SmallButton>+</SmallButton>
            </Styled.GuestsContainer>
          ) : (
            <SmallButton>Add a Guest</SmallButton>
          )}
        </>
      ) : (
        <Button>Count Me In!</Button>
      )}
    </Styled.SummaryContainer>
  );
};

export default UserAttendanceSummary;
