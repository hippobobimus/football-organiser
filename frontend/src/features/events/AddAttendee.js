import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Button, Subtitle } from "../../components/styles";
import { Spinner } from "../../components/spinner";
import { MultiStepForm, FormStep, SelectField } from "../../components/form";
import { createAttendee, reset as resetEvents } from "./eventsSlice";
import {
  fetchUsers,
  reset as resetUsers,
  selectAllUsers,
} from "../users/usersSlice";
import { attendeeUserSchema } from "./eventValidation";

const AddAttendee = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: eventId } = useParams();

  const { updateStatus, updateMessage } = useSelector((state) => state.events);
  const { fetchStatus, fetchMessage } = useSelector((state) => state.users);
  const users = useSelector(selectAllUsers);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (updateStatus === "success") {
      dispatch(resetEvents());
      dispatch(resetUsers());
      navigate(`/events/${eventId}`);
    }
  }, [dispatch, eventId, navigate, updateStatus]);

  const handleCancel = () => {
    dispatch(resetEvents());
    dispatch(resetUsers());
    navigate(`/events/${eventId}`);
  };

  const handleSubmit = (values) => {
    dispatch(createAttendee(values));
  };

  const handleBack = () => {
    dispatch(resetEvents());
    dispatch(resetUsers());
    navigate(`/events/${eventId}`);
  };

  if (
    fetchStatus === "idle" ||
    fetchStatus === "loading" ||
    updateStatus === "loading"
  ) {
    return <Spinner />;
  }

  if (fetchStatus === "error" || updateStatus === "error") {
    return (
      <>
        <Subtitle>Something went wrong...</Subtitle>
        {updateMessage && <p>{updateMessage}</p>}
        {fetchMessage && <p>{fetchMessage}</p>}
        <Button type="button" onClick={handleBack}>
          Back
        </Button>
      </>
    );
  }

  const usersOptionsList = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  return (
    <>
      <Subtitle>Add User to Event</Subtitle>
      <MultiStepForm
        initialValues={{
          userId: "",
          eventId,
          guests: 0,
        }}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      >
        <FormStep validationSchema={attendeeUserSchema}>
          <SelectField label="User" name="userId">
            <option></option>
            {usersOptionsList}
          </SelectField>
        </FormStep>
      </MultiStepForm>
    </>
  );
};

export default AddAttendee;
