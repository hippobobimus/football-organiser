import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button, SectionHeading, Subtitle } from '../../components/styles';
import { Spinner } from '../../components/spinner';
import { MultiStepForm, FormStep, TextInput } from '../../components/form';
import { addressSchema, eventInfoSchema } from './eventValidation';
import { createEvent, reset } from './eventsSlice';

const CreateEvent = ({ category }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userEntries, setUserEntries] = useState({
    category,
    name: category === 'match' ? 'Football Match' : '',
    buildUpTime: '',
    startTime: '',
    endTime: '',
    locationName: '',
    locationLine1: '',
    locationLine2: '',
    locationTown: '',
    locationPostcode: '',
    capacity: '',
  });

  const { eventDetails, updateStatus, updateMessage } = useSelector(
    (state) => state.events
  );

  const handleSubmit = (values) => {
    setUserEntries(values);
    dispatch(createEvent(values));
  };

  const handleCancel = () => {
    dispatch(reset());
    navigate('/calendar');
  };

  const handleBack = () => {
    dispatch(reset());
  };

  useEffect(() => {
    if (updateStatus === 'success') {
      dispatch(reset());
      navigate(`/events/${eventDetails.id}`);
    }
  }, [dispatch, navigate, eventDetails, updateStatus]);

  if (updateStatus === 'loading') {
    return <Spinner />;
  }

  if (updateStatus === 'error') {
    return (
      <>
        <Subtitle>Something went wrong...</Subtitle>
        <p>{updateMessage}</p>
        <Button type='button' onClick={handleBack}>
          Back
        </Button>
      </>
    );
  }

  return (
    <>
      <Subtitle>
        {category === 'match' && 'Create a New Match'}
        {category === 'social' && 'Create a New Social'}
      </Subtitle>
      <MultiStepForm
        initialValues={userEntries}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      >
        <FormStep validationSchema={eventInfoSchema}>
          {category === 'social' && (
            <TextInput label='Name' name='name' type='text' />
          )}
          <TextInput label='Warm Up' name='buildUpTime' type='datetime-local' />
          <TextInput label='Kick Off' name='startTime' type='datetime-local' />
          <TextInput label='Finish' name='endTime' type='datetime-local' />
          <TextInput label='Maximum No. of Attendees (optional)' name='capacity' type='number' />
        </FormStep>
        <FormStep validationSchema={addressSchema}>
          <SectionHeading>Address</SectionHeading>
          <TextInput label='Name' name='locationName' type='text' />
          <TextInput label='Address Line 1' name='locationLine1' type='text' />
          <TextInput label='Address Line 2' name='locationLine2' type='text' />
          <TextInput label='Town' name='locationTown' type='text' />
          <TextInput label='Postcode' name='locationPostcode' type='text' />
        </FormStep>
      </MultiStepForm>
    </>
  );
};

export default CreateEvent;
