import { useEffect } from 'react';
import { toast } from 'react-toastify';

import {
  FormStep,
  MultiStepForm,
  SelectField,
} from '../../../../components/form';
import { Spinner } from '../../../../components/spinner';
import { DisplayError } from '../../../../components/DisplayError';
import { attendeeUserSchema } from './validation';
import { useAddUserToEventMutation } from '../../api/eventsApiSlice';
import { useGetUsersQuery } from '../../../users/api/usersApiSlice.js';

const SelectUserField = () => {
  const { data: users, isLoading, isError, error } = useGetUsersQuery();

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <DisplayError error={error} />;
  }

  const usersOptionList = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  return (
    <SelectField id="userId" label="User" name="userId">
      <option></option>
      {usersOptionList}
    </SelectField>
  );
};

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
