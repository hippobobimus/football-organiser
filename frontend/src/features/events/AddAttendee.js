import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Subtitle } from '../../components/styles';
import { Spinner } from '../../components/spinner';
import { MultiStepForm, FormStep, SelectField } from '../../components/form';
import { createAttendee, reset } from './eventsSlice';

const AddAttendee = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: eventId } = useParams();

  const { eventDetailsStatus, eventDetailsMessage } = useSelector((state) => state.events);

  const handleCancel = () => {
    dispatch(reset());
    navigate(`/events/${eventId}`);
  };

  const handleSubmit = (values) => {
    dispatch(createAttendee(values))
  };

  const handleBack = () => {
    dispatch(reset());
    navigate(`/events/${eventId}`);
  };

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
      <Subtitle>
        Add User to Event
      </Subtitle>
      <MultiStepForm
        initialValues={{
          userId: '',
          eventId,
          guests: 0,
        }}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      >
        <FormStep validationSchema={null}>
          <SelectField label='User' name='userId'>
            <option></option>
            <option value='628e47522adc3dfc24e0d887'>Lloyd Doyley</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </SelectField>
        </FormStep>
      </MultiStepForm>
    </>
  );
};

export default AddAttendee;
