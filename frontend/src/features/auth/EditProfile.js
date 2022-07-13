import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button, Subtitle } from '../../components/styles';
import { FormStep, MultiStepForm, TextInput } from '../../components/form';
import Spinner from '../../components/spinner/Spinner';
import { updateAuthUser, resetUpdate } from './authSlice';
import { userUpdateSchema } from './authUserValidation';

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authUser, updateStatus, updateMessage } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (updateStatus === 'success') {
      dispatch(resetUpdate());
      navigate('/profile');
    }
  }, [dispatch, navigate, updateStatus]);

  const handleSubmit = (values) => {
    dispatch(updateAuthUser(values));
  };

  const handleCancel = () => {
    dispatch(resetUpdate());
    navigate('/profile');
  };

  const handleBack = () => {
    dispatch(resetUpdate());
    navigate('/profile');
  };

  if (updateStatus === 'error') {
    return (
      <>
        <Subtitle>Something went wrong...</Subtitle>
        <p>{updateMessage}</p>
        <Button type="button" onClick={handleBack}>
          Back
        </Button>
      </>
    );
  }

  if (updateStatus === 'loading') {
    return <Spinner />;
  }

  return (
    <>
      <Subtitle>Edit Your Info</Subtitle>
      <MultiStepForm
        initialValues={{ currentPassword: '', ...authUser }}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      >
        <FormStep validationSchema={userUpdateSchema}>
          <TextInput label="First Name" name="firstName" type="text" />
          <TextInput label="Last Name" name="lastName" type="text" />
          <TextInput label="Email" name="email" type="email" />
          <TextInput
            label="Enter your current password"
            name="currentPassword"
            type="password"
          />
        </FormStep>
      </MultiStepForm>
    </>
  );
};

export default EditProfile;
