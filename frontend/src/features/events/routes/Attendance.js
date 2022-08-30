import { useNavigate, useParams } from 'react-router-dom';

import { Container } from '../../../components/styles';
import { AttendanceList } from '../components/AttendanceList';

export const Attendance = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const handleAddUser = () => {
    navigate(`add-user`);
  };

  return (
    <Container style={{ width: 'min(90%, 500px)', padding: '15px 0' }}>
      <AttendanceList eventId={eventId} onAddUser={handleAddUser} />
    </Container>
  );
};
