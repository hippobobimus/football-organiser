import { Link, useParams } from 'react-router-dom';

import { SmallButton, ButtonRow } from '../../../../components/styles';
import {
  useGetEventQuery,
  useUpdateEventMutation,
} from '../../api/eventsApiSlice';

export const EventAdminPanel = () => {
  const { eventId } = useParams();
  const [updateEvent, {}] = useUpdateEventMutation();
  const { data: event } = useGetEventQuery(eventId);

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this event?')) {
      updateEvent({ eventId, update: { isCancelled: true } });
    }
  };

  const handleUncancel = () => {};

  const handleDelete = () => {};

  return (
    <ButtonRow>
      <SmallButton as={Link} to="edit">
        Edit
      </SmallButton>
      {event?.isCancelled ? (
        <SmallButton type="button" onClick={handleUncancel}>
          Uncancel
        </SmallButton>
      ) : (
        <SmallButton type="button" onClick={handleCancel}>
          Cancel
        </SmallButton>
      )}
      <SmallButton type="button" onClick={handleDelete}>
        Delete
      </SmallButton>
    </ButtonRow>
  );
};
