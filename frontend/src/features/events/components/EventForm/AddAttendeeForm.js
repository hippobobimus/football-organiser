import { useEffect } from 'react';
import { toast } from 'react-toastify';

import { FormStep, MultiStepForm } from '../../../../components/Form';
import { SelectUserField } from '../../../users/components/SelectUserField';
import { attendeeUserSchema } from './validation';
import { useAddUserToEventMutation } from '../../api/eventsApiSlice';

export const AddAttendeeForm = ({ eventId, onCancel, onSuccess }) => {
  const [addUserToEvent, { isError, error, isSuccess }] =
    useAddUserToEventMutation();

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    } else if (isError) {
      toast.error(error.data?.message || error.message || error);
    }
  }, [isSuccess, isError, error, onSuccess]);

  const handleSubmit = async (values, actions) => {
    await addUserToEvent({ eventId, userId: values.userId });
    actions.resetForm();
  };

  return (
    <MultiStepForm
      initialValues={{
        userId: '',
        eventId,
        guests: 0,
      }}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    >
      <FormStep validationSchema={attendeeUserSchema}>
        <SelectUserField />
      </FormStep>
    </MultiStepForm>
  );
};
