import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { format, isPast } from 'date-fns';

import { Button, SectionHeading, Subtitle } from '../../components/styles';
import { Spinner } from '../../components/spinner';
import { MultiStepForm, FormStep, TextInput } from '../../components/form';
import {
  addressSchema,
  eventInfoSchema,
} from './components/EventForm/validation';
import { updateEvent, fetchOneEvent, reset } from './eventsSlice';

const EditEvent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id: eventId } = useParams();

  const [formattedTime, setFormattedTime] = useState(null);

  const {
    eventDetails,
    fetchStatus,
    fetchMessage,
    updateStatus,
    updateMessage,
  } = useSelector((state) => state.events);

  useEffect(() => {
    if (updateStatus === 'success') {
      navigate(`/events/${eventDetails.id}`);
      dispatch(reset());
    }
  }, [dispatch, navigate, eventDetails, updateStatus]);

  useEffect(() => {
    dispatch(fetchOneEvent(eventId));
  }, [dispatch, eventId]);

  // format event timing information.
  useEffect(() => {
    if (eventDetails?.time) {
      setFormattedTime({
        buildUp: format(
          Date.parse(eventDetails.time.buildUp),
          "yyyy-MM-dd'T'HH:mm"
        ),
        start: format(
          Date.parse(eventDetails.time.start),
          "yyyy-MM-dd'T'HH:mm"
        ),
        end: format(Date.parse(eventDetails.time.end), "yyyy-MM-dd'T'HH:mm"),
      });
    }
  }, [eventDetails]);

  const handleSubmit = (values) => {
    dispatch(updateEvent({ id: eventId, update: values }));
  };

  const handleCancel = () => {
    navigate(`/events/${eventId}`);
    dispatch(reset());
  };

  const handleBack = () => {
    navigate(`/events/${eventId}`);
    dispatch(reset());
  };

  if (
    fetchStatus === 'loading' ||
    fetchStatus === 'idle' ||
    updateStatus === 'loading' ||
    !formattedTime
  ) {
    return <Spinner />;
  }

  if (isPast(Date.parse(eventDetails.time.buildUp))) {
    return (
      <>
        <Subtitle>Event in progress/finished</Subtitle>
        <p>Editing is no longer possible</p>
        <Button type="button" onClick={handleBack}>
          Back
        </Button>
      </>
    );
  }

  if (fetchStatus === 'error' || updateStatus === 'error') {
    return (
      <>
        <Subtitle>Something went wrong...</Subtitle>
        {fetchMessage && <p>{fetchMessage}</p>}
        {updateMessage && <p>{updateMessage}</p>}
        <Button type="button" onClick={handleBack}>
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
            <TextInput label="Name" name="name" type="text" />
          )}
          <TextInput label="Warm Up" name="buildUpTime" type="datetime-local" />
          <TextInput label="Kick Off" name="startTime" type="datetime-local" />
          <TextInput label="Finish" name="endTime" type="datetime-local" />
          <TextInput
            label="Maximum No. of Attendees (optional)"
            name="capacity"
            type="number"
          />
        </FormStep>
        <FormStep validationSchema={addressSchema}>
          <SectionHeading>Address</SectionHeading>
          <TextInput label="Name" name="locationName" type="text" />
          <TextInput label="Address Line 1" name="locationLine1" type="text" />
          <TextInput label="Address Line 2" name="locationLine2" type="text" />
          <TextInput label="Town" name="locationTown" type="text" />
          <TextInput label="Postcode" name="locationPostcode" type="text" />
        </FormStep>
      </MultiStepForm>
    </>
  );
};

export default EditEvent;
