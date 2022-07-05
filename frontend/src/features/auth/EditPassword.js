import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Button, Subtitle } from "../../components/styles";
import { FormStep, MultiStepForm, TextInput } from "../../components/form";
import Spinner from "../../components/spinner/Spinner";
import { resetUpdate, updateAuthUser } from "./authSlice";
import { updatePasswordSchema } from "./authUserValidation";

const EditPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { updateStatus, updateMessage } = useSelector((state) => state.auth);

  useEffect(() => {
    if (updateStatus === "success") {
      dispatch(resetUpdate());
      navigate("/profile");
    }
  }, [dispatch, navigate, updateStatus]);

  const handleSubmit = (values) => {
    dispatch(updateAuthUser(values));
  };

  const handleCancel = () => {
    dispatch(resetUpdate());
    navigate("/profile");
  };

  const handleBack = () => {
    dispatch(resetUpdate());
    navigate("/profile");
  };

  if (updateStatus === "error") {
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

  if (updateStatus === "loading") {
    return <Spinner />;
  }

  return (
    <>
      <Subtitle>Change Your Password</Subtitle>
      <MultiStepForm
        initialValues={{
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      >
        <FormStep validationSchema={updatePasswordSchema}>
          <TextInput
            label="Current password"
            name="currentPassword"
            type="password"
          />
          <TextInput label="New password" name="newPassword" type="password" />
          <TextInput
            label="Confirm password"
            name="confirmPassword"
            type="password"
          />
        </FormStep>
      </MultiStepForm>
    </>
  );
};

export default EditPassword;
