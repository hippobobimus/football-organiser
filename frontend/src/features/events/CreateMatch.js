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
import { matchSchema } from './eventValidation';
import { createEvent, reset } from './eventsSlice';

const CreateMatch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userEntries, setUserEntries] = useState({
    buildUpTime: '',
    startTime: '',
    endTime: '',
  });

  const { eventDetails, eventDetailsStatus, eventDetailsMessage } = useSelector(
    (state) => state.events
  );

  const handleSubmit = (values) => {
    setUserEntries({
      buildUpTime: values?.buildUpTime,
      startTime: values?.startTime,
      endTime: values?.endTime,
    });
    dispatch(
      createEvent({ category: 'match', name: 'Football Match', ...values })
    );
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
      <Subtitle>Create a New Match</Subtitle>
      <Formik
        initialValues={{
          buildUpTime: userEntries.buildUpTime,
          startTime: userEntries.startTime,
          endTime: userEntries.endTime,
        }}
        validationSchema={matchSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form>
            <TextInput
              label='Warm Up'
              name='buildUpTime'
              type='datetime-local'
            />
            <TextInput
              label='Kick Off'
              name='startTime'
              type='datetime-local'
            />
            <TextInput
              label='Finish'
              name='endTime'
              type='datetime-local'
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

export default CreateMatch;
