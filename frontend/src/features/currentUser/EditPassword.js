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
import { updateCurrentUser, reset } from './currentUserSlice';
import { updatePasswordSchema } from '../validation/userValidation';

const EditPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateDone, setUpdateDone] = useState(false);
  const { status, message } = useSelector((state) => state.currentUser);

  useEffect(() => {
    if (updateDone && status === 'success') {
      dispatch(reset());
      navigate('/profile');
    }
  }, [dispatch, navigate, status, updateDone]);

  const handleSubmit = (values) => {
    dispatch(updateCurrentUser(values));
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
      <Subtitle>Change Your Password</Subtitle>

      <Formik
        initialValues={{
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }}
        validationSchema={updatePasswordSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form>
            <TextInput
              label='Current password'
              name='currentPassword'
              type='password'
            />
            <TextInput
              label='New password'
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

export default EditPassword;
