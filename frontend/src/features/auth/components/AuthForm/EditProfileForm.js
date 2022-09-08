import { useEffect } from 'react';
import { toast } from 'react-toastify';

import {
  FormStep,
  MultiStepForm,
  TextInput,
} from '../../../../components/Form';
import {
  useGetAuthUserQuery,
  useUpdateAuthUserMutation,
} from '../../api/authApiSlice';
import { userUpdateSchema } from './validation';

export const EditProfileForm = ({ onSuccess, onCancel }) => {
  const { data: user } = useGetAuthUserQuery();
  const [updateAuthUser, { isSuccess, isError, error }] =
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

  if (!user) {
    return null;
  }

  return (
    <MultiStepForm
      initialValues={{
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        currentPassword: '',
      }}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    >
      <FormStep validationSchema={userUpdateSchema}>
        <TextInput
          id="firstName"
          label="First Name"
          name="firstName"
          type="text"
        />
        <TextInput
          id="lastName"
          label="Last Name"
          name="lastName"
          type="text"
        />
        <TextInput id="email" label="Email" name="email" type="email" />
        <TextInput
          id="password"
          label="Enter your current password"
          name="currentPassword"
          type="password"
        />
      </FormStep>
    </MultiStepForm>
  );
};
