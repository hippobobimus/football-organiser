import { useMemo } from 'react';
import { useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

import {
  FormStep,
  MultiStepForm,
  TextInput,
} from '../../../../components/Form';
import { SectionHeading } from '../../../../components/styles';
import { eventInfoSchema, addressSchema } from './validation';
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
    <MultiStepForm
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
      onSubmit={handleSubmit}
      onCancel={onCancel}
    >
      <FormStep validationSchema={eventInfoSchema}>
        {event.category === 'social' && (
          <TextInput id="name" label="Name" name="name" type="text" />
        )}
        <TextInput
          id="buildUpTime"
          label="Warm Up*"
          name="buildUpTime"
          type="datetime-local"
        />
        <TextInput
          id="startTime"
          label="Kick Off*"
          name="startTime"
          type="datetime-local"
        />
        <TextInput
          id="endTime"
          label="Finish*"
          name="endTime"
          type="datetime-local"
        />
        <TextInput
          id="capacity"
          label="Maximum No. of Attendees (optional)"
          name="capacity"
          type="number"
        />
      </FormStep>
      <FormStep validationSchema={addressSchema}>
        <SectionHeading>Address</SectionHeading>
        <TextInput
          id="locationName"
          label="Name"
          name="locationName"
          type="text"
        />
        <TextInput
          id="locationLine1"
          label="Address Line 1*"
          name="locationLine1"
          type="text"
        />
        <TextInput
          id="locationLine2"
          label="Address Line 2"
          name="locationLine2"
          type="text"
        />
        <TextInput
          id="locationTown"
          label="Town*"
          name="locationTown"
          type="text"
        />
        <TextInput
          id="locationPostcode"
          label="Postcode*"
          name="locationPostcode"
          type="text"
        />
      </FormStep>
    </MultiStepForm>
  );
};
