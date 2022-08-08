import { useDispatch, useSelector } from 'react-redux';
import {
  mdiCloseCircleOutline,
  mdiAccountMultiplePlusOutline,
  mdiAccountMultipleMinusOutline,
} from '@mdi/js';

import * as Styled from './AttendanceListItem.styles';
import { deleteAttendee, updateAttendee } from './eventsSlice';

const AttendanceListItem = ({ attendee, isGuest }) => {
  const dispatch = useDispatch();

  const { isAdmin } = useSelector((state) => state.auth.user);

  const handleAddGuest = () => {
    dispatch(
      updateAttendee({
        userId: attendee.user.id,
        eventId: attendee.event,
        guests: attendee.guests + 1,
      })
    );
  };

  const handleRemoveGuest = () => {
    dispatch(
      updateAttendee({
        userId: attendee.user.id,
        eventId: attendee.event,
        guests: attendee.guests - 1,
      })
    );
  };

  const handleDeleteAttendee = () => {
    dispatch(
      deleteAttendee({
        userId: attendee.user.id,
        eventId: attendee.event,
      })
    );
  };

  return (
    <Styled.ListItem>
      <Styled.Content>
        {isGuest && 'Guest of'} {attendee.user?.name || 'unknown user'}
      </Styled.Content>
      {isAdmin && !isGuest && (
        <Styled.IconContainer>
          <Styled.Icon
            path={mdiAccountMultipleMinusOutline}
            size={0.65}
            title="Remove guest"
            onClick={handleRemoveGuest}
          />
          <Styled.Icon
            path={mdiAccountMultiplePlusOutline}
            size={0.65}
            title="Add guest"
            onClick={handleAddGuest}
          />
          <Styled.Icon
            path={mdiCloseCircleOutline}
            size={0.65}
            title="Remove user and guests"
            onClick={handleDeleteAttendee}
          />
        </Styled.IconContainer>
      )}
    </Styled.ListItem>
  );
};

export default AttendanceListItem;
