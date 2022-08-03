import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { FormStep, MultiStepForm, TextInput } from '../../../components/form';
import Spinner from '../../../components/spinner/Spinner';
import { Button, Subtitle } from '../../../components/styles';
import { register, reset } from '../stores/authSlice';
import { userRegistrationSchema } from '../authUserValidation';

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
    // ensure password not stored.
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

  if (isLoggedIn || status === 'success') {
    return (
      <>
        <Subtitle>Welcome!</Subtitle>
        <Button as={Link} to="/">
          Get Started
        </Button>
      </>
    );
  }

  if (status === 'error') {
    return (
      <>
        <Subtitle>Something went wrong...</Subtitle>
        <p>{message}</p>
        <Button type="button" onClick={() => dispatch(reset())}>
          Back
        </Button>
      </>
    );
  }

  if (status === 'loading') {
    return <Spinner />;
  }

  return (
    <>
      <Subtitle>Create an Account</Subtitle>
      <MultiStepForm
        initialValues={{ newPassword: '', confirmPassword: '', ...userEntry }}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      >
        <FormStep validationSchema={userRegistrationSchema}>
          <TextInput label="First Name" name="firstName" type="text" />
          <TextInput label="Last Name" name="lastName" type="text" />
          <TextInput label="Email" name="email" type="email" />
          <TextInput
            label="Enter a strong password"
            name="newPassword"
            type="password"
          />
          <TextInput
            label="Confirm password"
            name="confirmPassword"
            type="password"
          />
        </FormStep>
      </MultiStepForm>
    </>
  );
};

export default Register;
