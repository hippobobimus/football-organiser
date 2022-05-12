import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';

import { Button, Card, Subtitle } from '../../components/styles';
import {
  Form,
  FormButton,
  FormButtonContainer,
  TextInput,
} from '../../components/form';
import Spinner from '../../components/spinner/Spinner';
import { getCurrentUser, updateCurrentUser, reset } from './currentUserSlice';
import { userUpdateSchema } from '../validation/userValidation';

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateDone, setUpdateDone] = useState(false);
  const { data, status, message } = useSelector((state) => state.currentUser);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(getCurrentUser());
    }
    if (updateDone && status === 'success') {
      dispatch(reset());
      navigate('/profile');
    }
  }, [dispatch, navigate, status, updateDone]);

  const handleSubmit = async (values) => {
    dispatch(updateCurrentUser(values));
    setUpdateDone(true);
  };

  const handleCancel = async () => {
    dispatch(reset());
    navigate('/profile');
  };

  const handleBack = () => {
    dispatch(reset());
    navigate('/profile');
  };

  if (status === 'error') {
    return (
      <Card>
        <Subtitle>Something went wrong...</Subtitle>
        <p>Error: {message}</p>
        <Button type='button' onClick={handleBack}>
          Back
        </Button>
      </Card>
    );
  }

  if (status === 'loading' || status === 'idle') {
    return (
      <Card>
        <Spinner />
      </Card>
    );
  }

  return (
    <Card>
      <Subtitle>Edit Your Info</Subtitle>

      <Formik
        initialValues={{ currentPassword: '', ...data }}
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
    </Card>
  );
};

export default EditProfile;
