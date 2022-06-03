import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Subtitle } from '../../components/styles';
import { Spinner } from '../../components/spinner';
import { fetchNextMatch } from './eventsSlice';
import EventView from './EventView';

const NextMatch = () => {
  const dispatch = useDispatch();

  const { eventDetails, eventDetailsStatus, eventDetailsMessage } = useSelector(
    (state) => state.events
  );

  useEffect(() => {
    dispatch(fetchNextMatch());
  }, [dispatch]);

  if (eventDetailsStatus === 'error') {
    return (
      <>
        <Subtitle>Something went wrong...</Subtitle>
        <p>{eventDetailsMessage}</p>
      </>
    );
  }

  if (eventDetailsStatus === 'loading' || eventDetailsStatus === 'idle') {
    return <Spinner />;
  }

  return <EventView event={eventDetails} />;
};

export default NextMatch;
