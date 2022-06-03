import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button, SectionHeading, Subtitle } from '../../components/styles';
import { Spinner } from '../../components/spinner';
import {
  MultiStepForm,
  FormStep,
  TextInput,
} from '../../components/form';
import { addressSchema, matchSchema } from './eventValidation';
import { createEvent, reset } from './eventsSlice';

const CreateMatch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
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
    setSubmitted(true);
    dispatch(
      createEvent({ category: 'match', name: 'Football Match', ...values })
    );
  };

  const handleCancel = () => {
    dispatch(reset());
    navigate('/calendar');
  };

  const handleBack = () => {
    dispatch(reset());
    setSubmitted(false);
  };

  useEffect(() => {
    if (submitted && eventDetailsStatus === 'success') {
      navigate(`/events/${eventDetails.id}`);
      dispatch(reset());
    }
  }, [dispatch, navigate, eventDetails, eventDetailsStatus, submitted]);

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
      <MultiStepForm
        initialValues={{
          buildUpTime: userEntries.buildUpTime,
          startTime: userEntries.startTime,
          endTime: userEntries.endTime,
        }}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      >
        <FormStep validationSchema={matchSchema}>
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
        </FormStep>
        <FormStep validationSchema={addressSchema}>
          <SectionHeading>Address</SectionHeading>
            <TextInput
              label='Name'
              name='locationName'
              type='text'
            />
            <TextInput
              label='Address Line 1'
              name='locationLine1'
              type='text'
            />
            <TextInput
              label='Address Line 2'
              name='locationLine2'
              type='text'
            />
            <TextInput
              label='Town'
              name='locationTown'
              type='text'
            />
            <TextInput
              label='Postcode'
              name='locationPostcode'
              type='text'
            />
        </FormStep>
      </MultiStepForm>
    </>
  );
};

export default CreateMatch;
