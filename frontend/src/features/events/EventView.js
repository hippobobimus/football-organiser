import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Subtitle } from '../../components/styles';
import { Spinner } from '../../components/spinner';
import * as Styled from './EventView.styles';
import {
  fetchAuthUserEventAttendee,
  fetchEventAttendees,
  selectAllAttendees,
} from './attendees/attendeesSlice';
import EventCarousel from './EventCarousel';
import UserAttendanceSummary from './UserAttendanceSummary';

const EventView = ({eventDetails}) => {
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

  // TODO dummy data
  const location = {
    name: 'Powerleague Watford',
    number: '',
    street: 'Aldenham Road',
    city: 'Watford',
    postcode: 'WD23 2TY',
  };

  useEffect(() => {
    if (attendeesStatus === 'idle') {
      dispatch(fetchEventAttendees(eventDetails.id));
    }
    if (attendeeDetailsStatus === 'idle') {
      dispatch(fetchAuthUserEventAttendee(eventDetails.id));
    }
  }, [
    attendeesStatus,
    attendeeDetailsStatus,
    eventDetails,
    dispatch,
  ]);

  if (
    attendeesStatus === 'error' ||
    attendeeDetailsStatus === 'error'
  ) {
    return (
      <>
        <Subtitle>Something went wrong...</Subtitle>
        {attendeesMessage && <p>{attendeesMessage}</p>}
        {attendeeDetailsMessage && <p>{attendeeDetailsMessage}</p>}
      </>
    );
  }

  if (
    attendeesStatus === 'loading' ||
    attendeeDetailsStatus === 'loading'
  ) {
    return <Spinner />;
  }

  return (
    <Styled.ContentContainer>
      <Subtitle>{eventDetails?.name}</Subtitle>
      <UserAttendanceSummary
        attendeeDetails={attendeeDetails}
        eventDetails={eventDetails}
      />
      <EventCarousel
        eventDetails={eventDetails}
        location={location}
        attendees={attendees}
      />
    </Styled.ContentContainer>
  );
};

export default EventView;
