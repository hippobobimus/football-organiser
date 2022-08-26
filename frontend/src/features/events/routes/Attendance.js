import { useNavigate, useParams } from 'react-router-dom';

import { Section, Container } from '../../../components/styles';
import { AttendanceList } from '../components/AttendanceList';

export const Attendance = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const handleAddUser = () => {
    navigate(`add-user`);
  };

  return (
    <Container>
      <Section style={{ width: 'min(100%, 500px)' }}>
        <AttendanceList eventId={eventId} onAddUser={handleAddUser} />
      </Section>
    </Container>
  );
};
