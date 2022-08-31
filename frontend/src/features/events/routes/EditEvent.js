import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Container, Subtitle } from '../../../components/styles';
import { EditEventForm } from '../components/EventForm';

export const EditEvent = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const handleSuccess = () => {
    navigate(`/calendar/${eventId}`);
    toast.success('Event updated');
  };

  const handleCancel = () => {
    navigate(`/calendar/${eventId}`);
  };

  return (
    <Container style={{ width: '100%', padding: '20px 0 30px 0' }}>
      <Subtitle>Edit Event</Subtitle>
      <EditEventForm
        eventId={eventId}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </Container>
  );
};
