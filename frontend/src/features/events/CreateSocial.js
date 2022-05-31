import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';

import { Button, Subtitle } from '../../components/styles';
import { Spinner } from '../../components/spinner';
import {
  Form,
  FormButton,
  FormButtonContainer,
  TextInput,
} from '../../components/form';
import { createEvent, reset } from './eventsSlice';
import { socialSchema } from './eventValidation';

const CreateSocial = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userEntries, setUserEntries] = useState({
    name: '',
    buildUpTime: '',
    startTime: '',
    endTime: '',
  });

  const { eventDetails, eventDetailsStatus, eventDetailsMessage } = useSelector(
    (state) => state.events
  );

  const handleSubmit = (values) => {
    setUserEntries({
      name: values.name,
      buildUpTime: values?.buildUpTime,
      startTime: values?.startTime,
      endTime: values?.endTime,
    });
    dispatch(createEvent({ category: 'social', ...values }));
  };

  const handleCancel = () => {
    navigate('/calendar');
    dispatch(reset());
  };

  const handleBack = () => {
    dispatch(reset());
  };

  useEffect(() => {
    if (eventDetailsStatus === 'success') {
      navigate(`/events/${eventDetails.id}`);
      dispatch(reset());
    }
  }, [dispatch, navigate, eventDetails, eventDetailsStatus]);

  if (eventDetailsStatus === 'loading') {
    return <Spinner />;
  }

  if (eventDetailsStatus === 'error') {
    return (
      <>
        <Subtitle>Something went wrong...</Subtitle>
        <p>{eventDetailsMessage}</p>
        <Button type='button' onClick={handleBack}>
          Back
        </Button>
      </>
    );
  }

  return (
    <>
      <Subtitle>Create a New Social</Subtitle>
      <Formik
        initialValues={{
          name: userEntries.name,
          buildUpTime: userEntries.buildUpTime,
          startTime: userEntries.startTime,
          endTime: userEntries.endTime,
        }}
        validationSchema={socialSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form>
            <TextInput label='Name' name='name' type='text' />
            <TextInput
              label='Arrive From'
              name='buildUpTime'
              type='datetime-local'
            />
            <TextInput label='Start' name='startTime' type='datetime-local' />
            <TextInput label='Finish' name='endTime' type='datetime-local' />
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

export default CreateSocial;
