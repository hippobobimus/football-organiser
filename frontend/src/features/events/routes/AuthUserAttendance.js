import { useParams } from 'react-router-dom';

import { AuthUserAttendanceDisplay } from '../components/AuthUserAttendanceDisplay';
import {
  useUpdateAuthUserEventAttendeeMutation,
  useRemoveAuthUserFromEventMutation,
  useAddAuthUserToEventMutation,
  useGetEventQuery,
} from '../api/eventsApiSlice';

export const AuthUserAttendance = () => {
  const { eventId } = useParams();

  const [updateAuthUserEventAttendee] =
    useUpdateAuthUserEventAttendeeMutation();
  const [removeAuthUserFromEvent] = useRemoveAuthUserFromEventMutation();
  const [addAuthUserToEvent] = useAddAuthUserToEventMutation();
  const { data: event } = useGetEventQuery(eventId);

  if (!event || event.isCancelled) {
    return null;
  }

  const guests = event.authUserAttendee?.guests;
  const isAttending = !!event.authUserAttendee;

  const handleJoin = () => {
    addAuthUserToEvent(eventId);
  };

  const handleLeave = () => {
    removeAuthUserFromEvent(eventId);
  };

  const handleAddGuest = () => {
    updateAuthUserEventAttendee({
      eventId,
      update: { guests: guests + 1 },
    });
  };

  const handleRemoveGuest = () => {
    updateAuthUserEventAttendee({
      eventId,
      update: { guests: guests - 1 },
    });
  };

  return (
    <AuthUserAttendanceDisplay
      isAttending={isAttending}
      eventCategory={event.category}
      isFull={event.isFull}
      isFinished={event.isFinished}
      guests={guests}
      onJoin={handleJoin}
      onLeave={handleLeave}
      onAddGuest={handleAddGuest}
      onRemoveGuest={handleRemoveGuest}
    />
  );
};
