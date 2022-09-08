import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { SmallButton, ButtonRow } from '../../../../components/styles';
import {
  useGetEventQuery,
  useUpdateEventMutation,
  useDeleteEventMutation,
} from '../../api/eventsApiSlice';

export const EventAdminPanel = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [
    updateEvent,
    { isLoading: updateIsLoading, isError: updateIsError, error: updateError },
  ] = useUpdateEventMutation();
  const [
    deleteEvent,
    { isLoading: deleteIsLoading, isError: deleteIsError, error: deleteError },
  ] = useDeleteEventMutation();
  const { data: event } = useGetEventQuery(eventId);

  const isLoading = deleteIsLoading || updateIsLoading;

  useEffect(() => {
    if (updateIsError) {
      toast.error(updateError);
    }
  }, [updateIsError, updateError]);

  useEffect(() => {
    if (deleteIsError) {
      toast.error(deleteError);
    }
  }, [deleteIsError, deleteError]);

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this event?')) {
      updateEvent({ eventId, update: { isCancelled: true } });
    }
  };

  const handleUncancel = () => {
    if (window.confirm('Are you sure you want to reinstate this event?')) {
      updateEvent({ eventId, update: { isCancelled: false } });
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(eventId);
      navigate('/events');
      toast.success('Event deleted');
    }
  };

  if (!event) {
    return null;
  }

  return (
    <ButtonRow>
      <SmallButton as={Link} to="edit">
        Edit
      </SmallButton>
      {event.isCancelled ? (
        <SmallButton
          type="button"
          onClick={handleUncancel}
          disabled={isLoading}
        >
          Uncancel
        </SmallButton>
      ) : (
        <SmallButton type="button" onClick={handleCancel} disabled={isLoading}>
          Cancel
        </SmallButton>
      )}
      <SmallButton type="button" onClick={handleDelete} disabled={isLoading}>
        Delete
      </SmallButton>
    </ButtonRow>
  );
};
