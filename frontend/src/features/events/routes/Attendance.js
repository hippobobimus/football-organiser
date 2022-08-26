import { Section, Container } from '../../../components/styles';
import { AttendanceList } from '../components/AttendanceList';

export const Attendance = () => {
  return (
    <Container>
      <Section style={{ width: 'min(100%, 500px)' }}>
        <AttendanceList />
      </Section>
    </Container>
  );
};
