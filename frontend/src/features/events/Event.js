import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Subtitle } from '../../components/styles';
import { Spinner } from '../../components/spinner';
import { fetchOneEvent, updateEvent } from './eventsSlice';
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

  const handleCancel = () => {
    dispatch(updateEvent({ id: eventId, update: { isCancelled: true } }));
  };

  const handleUncancel = () => {
    dispatch(updateEvent({ id: eventId, update: { isCancelled: false } }));
  };

  return (
    <EventView
      event={eventDetails}
      onCancel={handleCancel}
      onUncancel={handleUncancel}
    />
  );
};

export default Event;
