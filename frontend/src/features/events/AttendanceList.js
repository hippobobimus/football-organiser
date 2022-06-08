import { Section } from '../../components/styles';
import * as Styled from './AttendanceList.styles';
import AttendanceListItem from './AttendanceListItem';

const AttendanceList = ({ attendees, isFull, capacity }) => {
  let listItems = [];
  let totalAttendance = 0;

  attendees?.forEach((attendee) => {
    const guests = attendee.guests || 0;

    listItems.push(
      <AttendanceListItem key={attendee.id} attendee={attendee} />
    );

    for (let i = 0; i < guests; i += 1) {
      listItems.push(
        <AttendanceListItem key={attendee.id + i} attendee={attendee} isGuest />
      );
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
