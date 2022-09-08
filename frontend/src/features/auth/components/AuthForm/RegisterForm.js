import { useEffect } from 'react';
import { toast } from 'react-toastify';

import {
  FormStep,
  MultiStepForm,
  TextInput,
} from '../../../../components/Form';
import { userRegistrationSchema } from './validation';
import { useRegisterMutation } from '../../api/authApiSlice';

export const RegisterForm = ({ onSuccess, onCancel }) => {
  const [register, { isError, error, isSuccess }] = useRegisterMutation();

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    } else if (isError) {
      toast.error(error.data?.message || error.message || error);
    }
  }, [isSuccess, isError, error, onSuccess]);

  const handleSubmit = async (values, actions) => {
    await register(values);
    actions.resetForm({
      values: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        newPassword: '',
        confirmPassword: '',
      },
    });
  };

  return (
    <MultiStepForm
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
        newPassword: '',
        confirmPassword: '',
      }}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    >
      <FormStep validationSchema={userRegistrationSchema}>
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
          id="newPassword"
          label="Enter a strong password"
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
