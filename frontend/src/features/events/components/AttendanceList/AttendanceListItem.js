import { useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  mdiCloseCircleOutline,
  mdiAccountMultiplePlusOutline,
  mdiAccountMultipleMinusOutline,
} from '@mdi/js';

import * as Styled from './AttendanceListItem.styles';
import {
  useRemoveUserFromEventMutation,
  useUpdateUserEventAttendeeMutation,
} from '../../api/eventsApiSlice';

const AttendanceListItemDisplay = ({
  name,
  isAdmin,
  isGuest,
  onRemoveGuest,
  onAddGuest,
  onDelete,
}) => {
  return (
    <Styled.ListItem>
      <Styled.Content>
        {isGuest && 'Guest of'} {name || 'unknown user'}
      </Styled.Content>
      {isAdmin && !isGuest && (
        <Styled.IconContainer>
          <Styled.Icon
            path={mdiAccountMultipleMinusOutline}
            size={0.65}
            title="Remove guest"
            onClick={onRemoveGuest}
          />
          <Styled.Icon
            path={mdiAccountMultiplePlusOutline}
            size={0.65}
            title="Add guest"
            onClick={onAddGuest}
          />
          <Styled.Icon
            path={mdiCloseCircleOutline}
            size={0.65}
            title="Remove user and guests"
            onClick={onDelete}
          />
        </Styled.IconContainer>
      )}
    </Styled.ListItem>
  );
};

export const AttendanceListItem = ({ attendee, isAdmin, isGuest }) => {
  const [
    updateUserEventAttendee,
    { isSuccess: updateIsSuccess, isError: updateIsError, error: updateError },
  ] = useUpdateUserEventAttendeeMutation();

  const [
    removeUserFromEvent,
    { isSuccess: removeIsSuccess, isError: removeIsError, error: removeError },
  ] = useRemoveUserFromEventMutation();

  useEffect(() => {
    if (removeIsSuccess) {
      toast.success('Removed user from lineup');
    }
    if (removeIsError) {
      toast.error(removeError);
    }
  }, [removeIsSuccess, removeIsError, removeError]);

  useEffect(() => {
    if (updateIsSuccess) {
      toast.success('Updated lineup');
    }
    if (updateIsError) {
      toast.error(updateError);
    }
  }, [updateIsSuccess, updateIsError, updateError]);

  const handleAddGuest = () => {
    updateUserEventAttendee({
      userId: attendee.user.id,
      eventId: attendee.event,
      update: { guests: attendee.guests + 1 },
    });
  };

  const handleRemoveGuest = () => {
    updateUserEventAttendee({
      userId: attendee.user.id,
      eventId: attendee.event,
      update: { guests: attendee.guests - 1 },
    });
  };

  const handleDeleteAttendee = () => {
    removeUserFromEvent({
      userId: attendee.user.id,
      eventId: attendee.event,
    });
  };

  return (
    <AttendanceListItemDisplay
      name={attendee.user.name}
      isAdmin={isAdmin}
      isGuest={isGuest}
      onAddGuest={handleAddGuest}
      onRemoveGuest={handleRemoveGuest}
      onDelete={handleDeleteAttendee}
    />
  );
};
