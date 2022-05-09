import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Form from '../../components/form/Form';
import Spinner from '../../components/spinner/Spinner';
import { Button, Subtitle } from '../../components/styles';
import { login, reset } from './authSlice';

function RegisterForm({ title }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    email: '',
    password: '',
  });

  const { email, password } = fields;

  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  const inputs = [
    {
      id: 0,
      name: 'email',
      type: 'email',
      placeholder: 'roberto@carlos.com',
      errorMessage: 'Please enter a valid email address.',
      label: 'Email',
      required: true,
    },
    {
      id: 1,
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      errorMessage: 'Please enter your password.',
      label: 'Password',
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
      login({
        email,
        password,
      })
    );
  };

  const handleBack = () => {
    setFields({
      ...fields,
      password: '',
    });
    dispatch(reset());
  };

  useEffect(() => {
    if (isSuccess || user) {
      navigate('/');
    }
    dispatch(reset());
  }, [user, isSuccess, dispatch, navigate]);

  if (isError) {
    return (
      <>
        <Subtitle>Oops...</Subtitle>
        <p>{message}</p>
        <Button onClick={handleBack}>Back</Button>
      </>
    );
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Subtitle>{title}</Subtitle>
      <Form
        fields={fields}
        inputs={inputs}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </>
  );
}

export default RegisterForm;
