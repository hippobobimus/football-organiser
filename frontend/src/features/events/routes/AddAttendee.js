import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Container, Subtitle } from '../../../components/styles';
import { AddAttendeeForm } from '../components/EventForm';

export const AddAttendee = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate(`/calendar/${eventId}/lineup`);
    toast.success('Added user');
  };

  const handleCancel = () => {
    navigate(`/calendar/${eventId}/lineup`);
  };

  return (
    <Container>
      <Subtitle>Add User to Event</Subtitle>
      <AddAttendeeForm
        eventId={eventId}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </Container>
  );
};
