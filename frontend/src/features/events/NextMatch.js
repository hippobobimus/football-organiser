import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Subtitle } from '../../components/styles';
import { Spinner } from '../../components/spinner';
import * as Styled from './NextMatch.styles';
import { fetchEvents, selectNextMatchId } from './eventsSlice';
import { fetchUsers } from '../users/usersSlice';
import {
  getCurrentUser,
  selectCurrentUserId,
} from '../currentUser/currentUserSlice';
import EventDetails from './EventDetails';
import UserAttendanceSummary from './UserAttendanceSummary';

const NextMatch = () => {
  const dispatch = useDispatch();

  // events
  const { status: eventsStatus, message: eventsMessage } = useSelector((state) => state.events);
  const nextMatchId = useSelector(selectNextMatchId);

  // current user
  const { status: currentUserStatus, message: currentUserMessage } =
    useSelector((state) => state.currentUser);
  const userId = useSelector(selectCurrentUserId);

  // users
  const { status: usersStatus, message: usersMessage } = useSelector(
    (state) => state.users
  );

  useEffect(() => {
    if (eventsStatus === 'idle') {
      dispatch(fetchEvents());
    }
    if (currentUserStatus === 'idle') {
      dispatch(getCurrentUser());
    }
    if (usersStatus === 'idle') {
      dispatch(fetchUsers());
    }
  }, [eventsStatus, currentUserStatus, usersStatus, dispatch]);

  if (
    eventsStatus === 'error' ||
    currentUserStatus === 'error' ||
    usersStatus === 'error'
  ) {
    return (
      <>
        <Subtitle>Something went wrong...</Subtitle>
        {eventsMessage && <p>{eventsMessage}</p>}
        {currentUserMessage && <p>{currentUserMessage}</p>}
        {usersMessage && <p>{usersMessage}</p>}
      </>
    );
  }

  if (
    eventsStatus === 'loading' ||
    currentUserStatus === 'loading' ||
    usersStatus === 'loading'
  ) {
    return <Spinner />;
  }

  return (
    <Styled.ContentContainer>
      <Subtitle>Next Match</Subtitle>
      <UserAttendanceSummary eventId={nextMatchId} userId={userId} />
      <EventDetails eventId={nextMatchId} />
    </Styled.ContentContainer>
  );
};

export default NextMatch;
