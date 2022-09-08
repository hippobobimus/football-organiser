import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Subtitle } from '../../../components/styles';
import { CreateEventForm } from '../components/EventForm';

export const CreateEvent = ({ category }) => {
  const navigate = useNavigate();

  const handleSuccess = (eventId) => {
    navigate(`/events/${eventId}`);
    toast.success('New event created');
  };

  const handleCancel = () => {
    navigate('/events');
  };

  return (
    <>
      <Subtitle>
        {category === 'match' && 'Create a New Match'}
        {category === 'social' && 'Create a New Social'}
      </Subtitle>
      <CreateEventForm
        category={category}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </>
  );
};
