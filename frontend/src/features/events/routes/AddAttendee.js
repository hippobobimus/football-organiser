import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Container, Subtitle } from '../../../components/styles';
import { AddAttendeeForm } from '../components/EventForm';

export const AddAttendee = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate(`/events/${eventId}/lineup`);
    toast.success('Added user');
  };

  const handleCancel = () => {
    navigate(`/events/${eventId}/lineup`);
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
