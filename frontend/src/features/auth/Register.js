import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Form from '../../components/form/Form';
import Spinner from '../../components/spinner/Spinner';
import { Button, Card, Subtitle } from '../../components/styles';
import { register, reset } from './authSlice';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { firstName, lastName, email, password } = fields;

  const { isLoggedIn, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  const inputs = [
    {
      id: 0,
      name: 'firstName',
      type: 'text',
      placeholder: 'Roberto',
      errorMessage:
        'Please enter a valid first name containing only upper and lower case letters a-z, hyphens and apostrophes.',
      label: 'First Name',
      pattern: "[A-Za-z-']{1,}",
      required: true,
    },
    {
      id: 1,
      name: 'lastName',
      type: 'text',
      placeholder: 'Carlos',
      errorMessage:
        'Please enter a valid last name containing only upper and lower case letters a-z, hyphens and apostrophes.',
      label: 'Last Name',
      pattern: "[A-Za-z-']{1,}",
      required: true,
    },
    {
      id: 2,
      name: 'email',
      type: 'email',
      placeholder: 'roberto@carlos.com',
      errorMessage: 'Please enter a valid email address.',
      label: 'Email',
      required: true,
    },
    {
      id: 3,
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      errorMessage:
        'Please enter a strong password of at least 8 characters, containing a minimum of 1 upper case character, 1 lower case character and 1 symbol.',
      label: 'Password',
      pattern:
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&.])[A-Za-z0-9@$!%*?&.]{8,}$',
      required: true,
    },
    {
      id: 4,
      name: 'confirmPassword',
      type: 'password',
      placeholder: 'Confirm password',
      errorMessage: 'Passwords do not match.',
      label: 'Confirm Password',
      pattern: password,
      required: true,
    },
  ];

  const handleInputChange = (e) => {
    setFields({
      ...fields,
      [e.target.name]: e.target.value,
    });
  };

  inputs.forEach((input) => {
    input.key = input.id;
    input.value = fields[input.name];
    input.onChange = handleInputChange;
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      register({
        firstName,
        lastName,
        email,
        password,
      })
    );
  };

  const handleBack = () => {
    setFields({
      ...fields,
      password: '',
      confirmPassword: '',
    });
    dispatch(reset());
  };

  const handleDone = () => {
    navigate('/');
    dispatch(reset());
  };

  if (isSuccess || isLoggedIn) {
    return (
      <Card>
        <Subtitle>Welcome!</Subtitle>
        <Button onClick={handleDone}>Get Started</Button>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <Subtitle>Oops...</Subtitle>
        <p>{message}</p>
        <Button onClick={handleBack}>Back</Button>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <Spinner />
      </Card>
    );
  }

  return (
    <Card>
      <Subtitle>Create an Account</Subtitle>
      <Form
        fields={fields}
        inputs={inputs}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </Card>
  );
}

export default Register;
