import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { PageContainer } from '../../../components/Container';
import { EditEventForm } from '../components/EventForm';

export const EditEvent = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const handleSuccess = () => {
    navigate(`/events/${eventId}`);
    toast.success('Event updated');
  };

  const handleCancel = () => {
    navigate(`/events/${eventId}`);
  };

  return (
    <PageContainer style={{ width: '100%', padding: '20px 0 30px 0' }}>
      <EditEventForm
        eventId={eventId}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </PageContainer>
  );
};
