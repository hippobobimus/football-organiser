import { useEffect } from 'react';
import { toast } from 'react-toastify';

import { UpsertEventForm } from './UpsertEventForm';
import { useCreateEventMutation } from '../../api/eventsApiSlice';

export const CreateEventForm = ({ category, onSuccess, onCancel }) => {
  const [createEvent, { data: newEvent, isError, error, isSuccess }] =
    useCreateEventMutation();

  useEffect(() => {
    if (isSuccess) {
      onSuccess(newEvent.id);
    } else if (isError) {
      toast.error(error.data?.message || error.message || error);
    }
  }, [isSuccess, isError, error, onSuccess, newEvent]);

  const handleSubmit = async (values) => {
    await createEvent(values);
  };

  return (
    <UpsertEventForm
      initialValues={{
        category,
        name: category === 'match' ? 'Football Match' : '',
        buildUpTime: '',
        startTime: '',
        endTime: '',
        locationName: '',
        locationLine1: '',
        locationLine2: '',
        locationTown: '',
        locationPostcode: '',
        capacity: '',
      }}
      category={category}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
};
