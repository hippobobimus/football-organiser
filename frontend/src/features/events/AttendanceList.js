import { Section, SectionHeading } from '../../components/styles';
import * as Styled from './AttendanceList.styles';
import UserListItem from '../users/UserListItem';

const AttendanceList = ({ attendanceRecords }) => {
  let listItems = [];
  let totalAttendance = 0;

  attendanceRecords?.forEach(({ user, guests = 0 }) => {
    // user doc may or may not have been populated.
    const userId = user?.id || user;

    listItems.push(<UserListItem key={userId} userId={userId} />);

    for (let i = 0; i < guests; i += 1) {
      listItems.push(<UserListItem key={userId + i} userId={userId} isGuest />);
    }

    totalAttendance += 1 + guests;
  });

  if (totalAttendance === 0) {
    return <p>Nobody yet...</p>;
  }

  return (
    <Section style={{ width: '100%' }}>
      <SectionHeading>Total = {totalAttendance}</SectionHeading>
      <Styled.List>{listItems}</Styled.List>
    </Section>
  );
};

export default AttendanceList;
