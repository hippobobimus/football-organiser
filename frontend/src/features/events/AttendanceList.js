import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Section, SmallButton } from '../../components/styles';
import * as Styled from './AttendanceList.styles';
import AttendanceListItem from './AttendanceListItem';
import { reset } from './eventsSlice';

const AttendanceList = ({ attendees, eventId, isFull }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let listItems = [];

  const { isAdmin } = useSelector((state) => state.auth.user);

  let sortedAttendees;
  if (attendees) {
    sortedAttendees = [...attendees].sort((a, b) =>
      a.user.name.localeCompare(b.user.name)
    );
  }

  sortedAttendees?.forEach((attendee) => {
    const guests = attendee.guests || 0;

    listItems.push(
      <AttendanceListItem key={attendee.id} attendee={attendee} />
    );

    for (let i = 0; i < guests; i += 1) {
      listItems.push(
        <AttendanceListItem key={attendee.id + i} attendee={attendee} isGuest />
      );
    }
  });

  const handleAddUser = () => {
    dispatch(reset());
    navigate(`/events/${eventId}/add-user`);
  };

  return (
    <Section style={{ width: '100%' }}>
      <Styled.List>
        {listItems}
        {isAdmin && (
          <SmallButton type="button" disabled={isFull} onClick={handleAddUser}>
            Add User
          </SmallButton>
        )}
      </Styled.List>
    </Section>
  );
};

export default AttendanceList;
