import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';

import { Button, Subtitle } from '../../components/styles';
import {
  Form,
  FormButton,
  FormButtonContainer,
  TextInput,
} from '../../components/form';
import Spinner from '../../components/spinner/Spinner';
import { fetchAuthUser, reset, updateAuthUser } from './authSlice';
import { userUpdateSchema } from './authUserValidation';

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateDone, setUpdateDone] = useState(false);
  const { authUser, authUserStatus, authUserMessage } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (authUserStatus === 'idle') {
      dispatch(fetchAuthUser());
    }
    if (updateDone && authUserStatus === 'success') {
      dispatch(reset());
      navigate('/profile');
    }
  }, [dispatch, navigate, authUserStatus, updateDone]);

  const handleSubmit = (values) => {
    dispatch(updateAuthUser(values));
    setUpdateDone(true);
  };

  const handleCancel = () => {
    dispatch(reset());
    navigate('/profile');
  };

  const handleBack = () => {
    dispatch(reset());
    navigate('/profile');
  };

  if (authUserStatus === 'error') {
    return (
      <>
        <Subtitle>Something went wrong...</Subtitle>
        <p>{authUserMessage}</p>
        <Button type='button' onClick={handleBack}>
          Back
        </Button>
      </>
    );
  }

  if (authUserStatus === 'loading' || authUserStatus === 'idle') {
    return <Spinner />;
  }

  return (
    <>
      <Subtitle>Edit Your Info</Subtitle>

      <Formik
        initialValues={{ currentPassword: '', ...authUser }}
        validationSchema={userUpdateSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form>
            <TextInput label='First Name' name='firstName' type='text' />
            <TextInput label='Last Name' name='lastName' type='text' />
            <TextInput label='Email' name='email' type='email' />
            <TextInput
              label='Enter your current password'
              name='currentPassword'
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

export default EditProfile;
