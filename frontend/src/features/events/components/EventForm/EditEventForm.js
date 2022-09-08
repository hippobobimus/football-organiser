import { useMemo } from 'react';
import { useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

import { UpsertEventForm } from './UpsertEventForm';
import {
  useGetEventQuery,
  useUpdateEventMutation,
} from '../../api/eventsApiSlice';

export const EditEventForm = ({ eventId, onSuccess, onCancel }) => {
  const { data: event } = useGetEventQuery(eventId);
  const [updateEvent, { isError, error, isSuccess }] = useUpdateEventMutation();

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    } else if (isError) {
      toast.error(error.data?.message || error.message || error);
    }
  }, [isSuccess, isError, error, onSuccess]);

  const formattedTime = useMemo(
    () =>
      event?.time
        ? {
            buildUp: format(
              Date.parse(event.time.buildUp),
              "yyyy-MM-dd'T'HH:mm"
            ),
            start: format(Date.parse(event.time.start), "yyyy-MM-dd'T'HH:mm"),
            end: format(Date.parse(event.time.end), "yyyy-MM-dd'T'HH:mm"),
          }
        : null,
    [event?.time]
  );

  const handleSubmit = async (values) => {
    await updateEvent({ eventId, update: values });
  };

  if (!event) {
    return null;
  }

  return (
    <UpsertEventForm
      initialValues={{
        category: event.category,
        name: event.name,
        buildUpTime: formattedTime.buildUp,
        startTime: formattedTime.start,
        endTime: formattedTime.end,
        locationName: event.location.name,
        locationLine1: event.location.line1,
        locationLine2: event.location.line2,
        locationTown: event.location.town,
        locationPostcode: event.location.postcode,
        capacity: event.capacity > 0 ? event.capacity : '',
      }}
      category={event.category}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
};
