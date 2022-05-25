import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Subtitle } from '../../components/styles';
import { Spinner } from '../../components/spinner';
import * as Styled from './NextMatch.styles';
import { fetchNextMatch } from './eventsSlice';
import {
  fetchCurrentUserEventAttendeeDetails,
  fetchEventAttendees,
  selectAllAttendees,
} from './attendees/attendeesSlice';
import EventDetails from './EventDetails';
import UserAttendanceSummary from './UserAttendanceSummary';

const NextMatch = () => {
  const dispatch = useDispatch();

  // attendees
  const {
    status: attendeesStatus,
    message: attendeesMessage,
    attendeeDetails,
    attendeeDetailsStatus,
    attendeeDetailsMessage,
  } = useSelector((state) => state.attendees);
  const attendees = useSelector(selectAllAttendees);

  // events
  const { eventDetails, eventDetailsStatus, eventDetailsMessage } = useSelector(
    (state) => state.events
  );

  // TODO dummy data
  const location = {
    name: 'Powerleague Watford',
    number: '',
    street: 'Aldenham Road',
    city: 'Watford',
    postcode: 'WD23 2TY',
  };

  useEffect(() => {
    if (eventDetailsStatus === 'idle') {
      dispatch(fetchNextMatch());
    }
    if (eventDetailsStatus === 'success' && attendeesStatus === 'idle') {
      dispatch(fetchEventAttendees(eventDetails.id));
    }
    if (eventDetailsStatus === 'success' && attendeeDetailsStatus === 'idle') {
      dispatch(fetchCurrentUserEventAttendeeDetails(eventDetails.id));
    }
  }, [
    attendeesStatus,
    attendeeDetailsStatus,
    eventDetails,
    eventDetailsStatus,
    dispatch,
  ]);

  if (
    attendeesStatus === 'error' ||
    attendeeDetailsStatus === 'error' ||
    eventDetailsStatus === 'error'
  ) {
    return (
      <>
        <Subtitle>Something went wrong...</Subtitle>
        {attendeesMessage && <p>{attendeesMessage}</p>}
        {attendeeDetailsMessage && <p>{attendeeDetailsMessage}</p>}
        {eventDetailsMessage && <p>{eventDetailsMessage}</p>}
      </>
    );
  }

  if (
    attendeesStatus === 'loading' ||
    attendeeDetailsStatus === 'loading' ||
    eventDetailsStatus === 'loading'
  ) {
    return <Spinner />;
  }

  return (
    <Styled.ContentContainer>
      <Subtitle>Next Match</Subtitle>
      <UserAttendanceSummary
        attendeeDetails={attendeeDetails}
        eventId={eventDetails?.id}
      />
      <EventDetails
        event={eventDetails}
        location={location}
        attendees={attendees}
      />
    </Styled.ContentContainer>
  );
};

export default NextMatch;
