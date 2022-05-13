import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';

import {
  Form,
  FormButton,
  FormButtonContainer,
  TextInput,
} from '../../components/form';
import { userRegistrationSchema } from '../validation/userValidation';
import Spinner from '../../components/spinner/Spinner';
import { Button, Subtitle } from '../../components/styles';
import { register, reset } from './authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userEntry, setUserEntry] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const { isLoggedIn, status, message } = useSelector((state) => state.auth);

  const handleSubmit = (values) => {
    setUserEntry({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
    });
    dispatch(register(values));
  };

  const handleCancel = () => {
    navigate('/login');
    dispatch(reset());
  };

  const handleBack = () => {
    dispatch(reset());
  };

  const handleStart = () => {
    navigate('/');
    dispatch(reset());
  };

  if (isLoggedIn || status === 'success') {
    return (
      <>
        <Subtitle>Welcome!</Subtitle>
        <Button onClick={handleStart}>Get Started</Button>
      </>
    );
  }

  if (status === 'error') {
    return (
      <>
        <Subtitle>Something went wrong...</Subtitle>
        <p>{message}</p>
        <Button type='button' onClick={handleBack}>
          Back
        </Button>
      </>
    );
  }

  if (status === 'loading') {
    return (
      <>
        <Spinner />
      </>
    );
  }

  return (
    <>
      <Subtitle>Create an Account</Subtitle>
      <Formik
        initialValues={{
          firstName: userEntry.firstName,
          lastName: userEntry.lastName,
          email: userEntry.email,
          newPassword: '',
          confirmPassword: '',
        }}
        validationSchema={userRegistrationSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form>
            <TextInput label='First Name' name='firstName' type='text' />
            <TextInput label='Last Name' name='lastName' type='text' />
            <TextInput label='Email' name='email' type='email' />
            <TextInput
              label='Enter a strong password'
              name='newPassword'
              type='password'
            />
            <TextInput
              label='Confirm password'
              name='confirmPassword'
              type='password'
            />
            <FormButtonContainer>
              <FormButton type='button' onClick={handleCancel}>
                Cancel
              </FormButton>
              <FormButton type='submit' disabled={formik.isSubmitting}>
                Save
              </FormButton>
            </FormButtonContainer>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Register;
