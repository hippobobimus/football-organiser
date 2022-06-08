import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import { Button, Subtitle } from '../../components/styles';
import { Spinner } from '../../components/spinner';
import { deleteEvent, fetchOneEvent, reset, updateEvent } from './eventsSlice';
import EventView from './EventView';

const Event = () => {
  const dispatch = useDispatch();
  const { id: eventId } = useParams();

  const {
    eventDetails,
    eventDetailsStatus,
    eventDetailsMessage,
    deleteStatus,
    deleteMessage,
  } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchOneEvent(eventId));
  }, [eventId, dispatch]);

  if (eventDetailsStatus === 'error' || deleteStatus === 'error') {
    return (
      <>
        <Subtitle>Something went wrong...</Subtitle>
        {eventDetailsMessage && <p>{eventDetailsMessage}</p>}
        {deleteMessage && <p>{deleteMessage}</p>}
      </>
    );
  }

  if (deleteStatus === 'success') {
    return (
      <>
        <Subtitle>Event deleted</Subtitle>
        <Button
          as={Link}
          to='/calendar'
          onClick={() => {
            dispatch(reset());
            return true;
          }}
        >
          Ok
        </Button>
      </>
    );
  }

  if (
    eventDetailsStatus === 'loading' ||
    eventDetailsStatus === 'idle' ||
    deleteStatus === 'loading'
  ) {
    return <Spinner />;
  }

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this event?')) {
      dispatch(updateEvent({ id: eventId, update: { isCancelled: true } }));
    }
  };

  const handleUncancel = () => {
    dispatch(updateEvent({ id: eventId, update: { isCancelled: false } }));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      dispatch(deleteEvent(eventId));
    }
  };

  return (
    <EventView
      event={eventDetails}
      onCancel={handleCancel}
      onUncancel={handleUncancel}
      onDelete={handleDelete}
    />
  );
};

export default Event;
