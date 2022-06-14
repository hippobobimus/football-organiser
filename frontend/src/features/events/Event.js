import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Button, Subtitle } from '../../components/styles';
import { Spinner } from '../../components/spinner';
import { deleteEvent, fetchNextMatch, fetchOneEvent, reset, updateEvent } from './eventsSlice';
import EventView from './EventView';

const Event = ({ nextMatch }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id: eventId } = useParams();

  const {
    eventDetails,
    fetchStatus,
    fetchMessage,
    updateStatus,
    updateMessage,
    deleteStatus,
    deleteMessage,
  } = useSelector((state) => state.events);

  useEffect(() => {
    if (nextMatch) {
      dispatch(fetchNextMatch(eventId));
    } else if (eventId) {
      dispatch(fetchOneEvent(eventId));
    }
  }, [eventId, dispatch, nextMatch]);

  if (
    fetchStatus === 'error' ||
    updateStatus === 'error' ||
    deleteStatus === 'error'
  ) {
    return (
      <>
        <Subtitle>Something went wrong...</Subtitle>
        {fetchMessage && <p>{fetchMessage}</p>}
        {updateMessage && <p>{updateMessage}</p>}
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
    fetchStatus === 'idle' ||
    fetchStatus === 'loading' ||
    updateStatus === 'loading' ||
    deleteStatus === 'loading'
  ) {
    return <Spinner />;
  }

  const handleEdit = () => {
    dispatch(reset());
    navigate(`/events/${eventId}/edit`);
  };

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
      onEdit={handleEdit}
      onCancel={handleCancel}
      onUncancel={handleUncancel}
      onDelete={handleDelete}
    />
  );
};

export default Event;
