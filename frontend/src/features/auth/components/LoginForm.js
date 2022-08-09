import { useEffect } from 'react';
import { toast } from 'react-toastify';

import { FormStep, MultiStepForm, TextInput } from '../../../components/form';
import { Container, Link } from '../../../components/styles';
import { loginSchema } from '../authUserValidation';
import { useLoginMutation } from '../../api/apiSlice';

export const LoginForm = ({ onSuccess }) => {
  const [login, { isError, error, isSuccess }] = useLoginMutation();

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    } else if (isError) {
      toast.error(error.data.message);
    }
  }, [isSuccess, isError, error, onSuccess]);

  const handleSubmit = async (values, actions) => {
    try {
      await login(values);
    } catch (err) {
      toast.error(error.data?.message || error.message);
    }

    actions.resetForm({
      values: {
        email: values.email,
        currentPassword: '',
      },
    });
  };

  return (
    <>
      <MultiStepForm
        initialValues={{
          email: '',
          currentPassword: '',
        }}
        onSubmit={handleSubmit}
        submitLabel="Login"
      >
        <FormStep validationSchema={loginSchema}>
          <TextInput id="email" label="Email" name="email" type="email" />
          <TextInput
            id="password"
            label="Password"
            name="currentPassword"
            type="password"
          />
        </FormStep>
      </MultiStepForm>
      <Container>
        <p>Not registered yet?</p>
        <Link to="/register">Create an account</Link>
      </Container>
    </>
  );
};
