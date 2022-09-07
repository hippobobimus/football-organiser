import {
  FormStep,
  MultiStepForm,
  TextInput,
} from '../../../../components/Form';
import { SectionHeading } from '../../../../components/styles';
import { eventInfoSchema, addressSchema } from './validation';

const InfoFields = ({ category }) => {
  return (
    <>
      {category === 'social' && (
        <TextInput id="name" label="Name" name="name" type="text" />
      )}
      <TextInput
        id="buildUpTime"
        label="Warm Up*"
        name="buildUpTime"
        type="datetime-local"
      />
      <TextInput
        id="startTime"
        label="Kick Off*"
        name="startTime"
        type="datetime-local"
      />
      <TextInput
        id="endTime"
        label="Finish*"
        name="endTime"
        type="datetime-local"
      />
      <TextInput
        id="capacity"
        label="Maximum No. of Attendees (optional)"
        name="capacity"
        type="number"
      />
    </>
  );
};

const LocationFields = () => {
  return (
    <>
      <SectionHeading>Address</SectionHeading>
      <TextInput
        id="locationName"
        label="Name"
        name="locationName"
        type="text"
      />
      <TextInput
        id="locationLine1"
        label="Address Line 1*"
        name="locationLine1"
        type="text"
      />
      <TextInput
        id="locationLine2"
        label="Address Line 2"
        name="locationLine2"
        type="text"
      />
      <TextInput
        id="locationTown"
        label="Town*"
        name="locationTown"
        type="text"
      />
      <TextInput
        id="locationPostcode"
        label="Postcode*"
        name="locationPostcode"
        type="text"
      />
    </>
  );
};

export const UpsertEventForm = ({
  category,
  initialValues,
  onSubmit,
  onCancel,
}) => {
  return (
    <MultiStepForm
      initialValues={initialValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
    >
      <FormStep validationSchema={eventInfoSchema}>
        <InfoFields category={category} />
      </FormStep>
      <FormStep validationSchema={addressSchema}>
        <LocationFields />
      </FormStep>
    </MultiStepForm>
  );
};
