import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { PageContainer } from '../../../components/Container';
import { AttendanceList } from '../components/AttendanceList';

const AttendanceContainer = styled(PageContainer)`
  width: min(90%, 500px);
  padding: 15px 0;
`;

export const Attendance = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const handleAddUser = () => {
    navigate(`add-user`);
  };

  return (
    <AttendanceContainer>
      <AttendanceList eventId={eventId} onAddUser={handleAddUser} />
    </AttendanceContainer>
  );
};
