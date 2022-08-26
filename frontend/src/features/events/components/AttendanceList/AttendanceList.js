import { useMemo } from 'react';

import { SmallButton } from '../../../../components/styles';
import * as Styled from './AttendanceList.styles';
import { AttendanceListItem } from './AttendanceListItem';
import { useGetEventQuery } from '../../api/eventsApiSlice';
import { useGetAuthUserQuery } from '../../../auth/api/authApiSlice';

export const AttendanceList = ({ eventId, onAddUser }) => {
  const { data: user } = useGetAuthUserQuery();
  const { data: event } = useGetEventQuery(eventId);

  const isAdmin = user?.isAdmin;
  const attendees = event?.attendees;

  const sortedAttendees = useMemo(() => {
    if (!attendees) {
      return null;
    }
    return [...attendees].sort((a, b) =>
      a.user.name.localeCompare(b.user.name)
    );
  }, [attendees]);

  let listItems = [];
  sortedAttendees?.forEach((attendee) => {
    const guests = attendee.guests || 0;

    listItems.push(
      <AttendanceListItem
        key={attendee.id}
        attendee={attendee}
        isAdmin={isAdmin}
      />
    );

    for (let i = 0; i < guests; i += 1) {
      listItems.push(
        <AttendanceListItem
          key={attendee.id + i}
          attendee={attendee}
          isAdmin={isAdmin}
          isGuest
        />
      );
    }
  });

  return (
    <Styled.List>
      {listItems}
      {isAdmin && (
        <SmallButton type="button" disabled={event?.isFull} onClick={onAddUser}>
          Add User
        </SmallButton>
      )}
    </Styled.List>
  );
};
