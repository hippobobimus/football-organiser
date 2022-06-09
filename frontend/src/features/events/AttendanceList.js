import { useSelector } from 'react-redux';
import { Section, SmallButton } from '../../components/styles';
import * as Styled from './AttendanceList.styles';
import AttendanceListItem from './AttendanceListItem';

const AttendanceList = ({ attendees, isFull }) => {
  let listItems = [];

  const { isAdmin } = useSelector((state) => state.auth.authUser);

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
  });

  return (
    <Section style={{ width: '100%' }}>
      <Styled.List>
        {listItems}
        {isAdmin && <SmallButton disabled={isFull}>Add User</SmallButton>}
      </Styled.List>
    </Section>
  );
};

export default AttendanceList;
