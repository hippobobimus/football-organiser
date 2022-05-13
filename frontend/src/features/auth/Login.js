import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';

import {
  Form,
  FormButton,
  FormButtonContainer,
  TextInput,
} from '../../components/form';
import { loginSchema } from '../validation/userValidation';
import Spinner from '../../components/spinner/Spinner';
import { Button, Container, Link, Subtitle } from '../../components/styles';
import { login, reset } from './authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');

  // page the user was trying to access.
  const from = location.state?.from?.pathname || '/';

  const { isLoggedIn, status, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoggedIn || status === 'success') {
      // return to page user was trying to access, do not store login page in history.
      navigate(from, { replace: true });
      dispatch(reset());
    }
  }, [from, isLoggedIn, status, dispatch, navigate]);

  const handleSubmit = (values) => {
    // store entered email in order to prefill form if login fails and
    // needs to be reattempted.
    setUserEmail(values.email);
    dispatch(login(values));
  };

  const handleBack = () => {
    dispatch(reset());
  };

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
    return <Spinner />;
  }

  return (
    <>
      <Subtitle>Please Login</Subtitle>
      <Formik
        initialValues={{ email: userEmail, currentPassword: '' }}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form>
            <TextInput label='Email' name='email' type='email' />
            <TextInput
              label='Password'
              name='currentPassword'
              type='password'
            />
            <FormButtonContainer>
              <FormButton type='submit' disabled={formik.isSubmitting}>
                Login
              </FormButton>
            </FormButtonContainer>
          </Form>
        )}
      </Formik>
      <Container>
        <p>Not registered yet?</p>
        <Link to='/register'>Create an account</Link>
      </Container>
    </>
  );
};

export default Login;
