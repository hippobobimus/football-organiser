import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Subtitle } from '../../components/styles';
import { Spinner } from '../../components/spinner';
import { fetchOneEvent } from './eventsSlice';
import EventView from './EventView';

const Event = () => {
  const dispatch = useDispatch();
  const { id: eventId } = useParams();

  const { eventDetails, eventDetailsStatus, eventDetailsMessage } = useSelector(
    (state) => state.events
  );

  useEffect(() => {
    dispatch(fetchOneEvent(eventId));
  }, [eventId, dispatch]);

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

export default Event;
