import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';

import { Button, SectionHeading, Subtitle } from '../../components/styles';
import { Spinner } from '../../components/spinner';
import { MultiStepForm, FormStep, TextInput } from '../../components/form';
import { addressSchema, eventInfoSchema } from './eventValidation';
import { updateEvent, fetchOneEvent, reset } from './eventsSlice';

const EditEvent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id: eventId } = useParams();

  const [submitted, setSubmitted] = useState(false);
  const [formattedTime, setFormattedTime] = useState(null);

  const { eventDetails, eventDetailsStatus, eventDetailsMessage } = useSelector(
    (state) => state.events
  );

  useEffect(() => {
    dispatch(fetchOneEvent(eventId));
  }, [dispatch, eventId])

  // format event timing information.
  useEffect(() => {
    if (!eventDetails?.time) {
      return;
    }

    setFormattedTime({
      buildUp: format(Date.parse(eventDetails.time.buildUp), "yyyy-MM-dd'T'HH:mm"),
      start: format(Date.parse(eventDetails.time.start), "yyyy-MM-dd'T'HH:mm"),
      end: format(Date.parse(eventDetails.time.end), "yyyy-MM-dd'T'HH:mm"),
    });
  }, [eventDetails]);

  useEffect(() => {
    if (submitted && eventDetailsStatus === 'success') {
      navigate(`/events/${eventDetails.id}`);
      dispatch(reset());
    }
  }, [dispatch, navigate, eventDetails, eventDetailsStatus, submitted]);

  const handleSubmit = (values) => {
    setSubmitted(true);
    dispatch(updateEvent({ id: eventId, update: values}));
  };

  const handleCancel = () => {
    navigate(`/events/${eventId}`)
    dispatch(reset());
  };

  const handleBack = () => {
    navigate(`/events/${eventId}`)
    dispatch(reset());
  };

  if (eventDetailsStatus === 'loading' || eventDetailsStatus === 'idle' || !formattedTime) {
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
      <Subtitle>
        {eventDetails.category === 'match' && 'Edit Match'}
        {eventDetails.category === 'social' && 'Edit Social'}
      </Subtitle>
      <MultiStepForm
        initialValues={{
          category: eventDetails.category,
          name: eventDetails.name,
          timezone: 'europe/london',
          buildUpTime: formattedTime.buildUp,
          startTime: formattedTime.start,
          endTime: formattedTime.end,
          locationName: eventDetails.location.name,
          locationLine1: eventDetails.location.line1,
          locationLine2: eventDetails.location.line2,
          locationTown: eventDetails.location.town,
          locationPostcode: eventDetails.location.postcode,
          capacity: eventDetails.capacity > 0 ? eventDetails.capacity : '',
        }}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      >
        <FormStep validationSchema={eventInfoSchema}>
          {eventDetails.category === 'social' && (
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

export default EditEvent;
