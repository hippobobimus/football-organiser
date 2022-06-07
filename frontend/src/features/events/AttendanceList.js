import { Section } from '../../components/styles';
import * as Styled from './AttendanceList.styles';
import UserListItem from '../users/UserListItem';

const AttendanceList = ({ attendees, isFull, capacity }) => {
  let listItems = [];
  let totalAttendance = 0;

  attendees?.forEach(({ user, guests = 0 }) => {
    // user doc may or may not have been populated.
    const userId = user?.id || user;

    listItems.push(<UserListItem key={userId} user={user} />);

    for (let i = 0; i < guests; i += 1) {
      listItems.push(<UserListItem key={userId + i} user={user} isGuest />);
    }

    totalAttendance += 1 + guests;
  });

  if (totalAttendance === 0) {
    return <p>Nobody yet...</p>;
  }

  return (
    <Section style={{ width: '100%' }}>
      <Styled.AttendanceTotal>
        <span>Total = {totalAttendance}</span>
        <span>{isFull ? '(Full)' : capacity > -1 && `(Max. ${capacity})`}</span>
      </Styled.AttendanceTotal>
      <Styled.List>{listItems}</Styled.List>
    </Section>
  );
};

export default AttendanceList;
