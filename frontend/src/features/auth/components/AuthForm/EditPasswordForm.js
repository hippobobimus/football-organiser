import { useEffect } from 'react';
import { toast } from 'react-toastify';

import {
  FormStep,
  MultiStepForm,
  TextInput,
} from '../../../../components/form';
import { Spinner } from '../../../../components/spinner';
import { useUpdateAuthUserMutation } from '../../api/authApiSlice';
import { updatePasswordSchema } from './validation';

export const EditPasswordForm = ({ onSuccess, onCancel }) => {
  const [updateAuthUser, { isLoading, isSuccess, isError, error }] =
    useUpdateAuthUserMutation();

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    } else if (isError) {
      toast.error(error.data?.message || error.message || error);
    }
  }, [isSuccess, isError, error, onSuccess]);

  const handleSubmit = async (values, actions) => {
    await updateAuthUser(values);
    actions.resetForm();
  };

  const handleCancel = () => {
    onCancel();
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <MultiStepForm
      initialValues={{
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    >
      <FormStep validationSchema={updatePasswordSchema}>
        <TextInput
          id="currentPassword"
          label="Current password"
          name="currentPassword"
          type="password"
        />
        <TextInput
          id="newPassword"
          label="New password"
          name="newPassword"
          type="password"
        />
        <TextInput
          id="confirmPassword"
          label="Confirm password"
          name="confirmPassword"
          type="password"
        />
      </FormStep>
    </MultiStepForm>
  );
};
