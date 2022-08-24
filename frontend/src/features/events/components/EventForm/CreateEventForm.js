import { useEffect } from 'react';
import { toast } from 'react-toastify';

import {
  FormStep,
  MultiStepForm,
  TextInput,
} from '../../../../components/form';
import { SectionHeading } from '../../../../components/styles';
import { eventInfoSchema, addressSchema } from './validation';
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
    <MultiStepForm
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
      onSubmit={handleSubmit}
      onCancel={onCancel}
    >
      <FormStep validationSchema={eventInfoSchema}>
        {category === 'social' && (
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
