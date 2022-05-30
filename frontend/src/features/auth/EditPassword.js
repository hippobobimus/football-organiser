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
import { reset, updateAuthUser } from './authSlice';
import { updatePasswordSchema } from './authUserValidation';

const EditPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateDone, setUpdateDone] = useState(false);
  const { authUserStatus, authUserMessage } = useSelector((state) => state.auth);

  useEffect(() => {
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

  if (authUserStatus === 'loading') {
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
