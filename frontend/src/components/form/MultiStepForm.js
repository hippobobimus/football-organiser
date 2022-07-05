import React, { useState } from "react";
import { Formik } from "formik";

import * as Styled from "./MultiStepForm.styles";

const MultiStepForm = ({
  children,
  initialValues,
  onSubmit,
  onCancel,
  submitLabel,
}) => {
  const [stepNum, setStepNum] = useState(0);
  const steps = React.Children.toArray(children);
  const [snapshot, setSnapshot] = useState(initialValues);

  const step = steps[stepNum];
  const totalSteps = steps.length;
  const isLastStep = stepNum === totalSteps - 1;

  const handleNext = (values) => {
    setSnapshot(values);
    setStepNum((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const handleBack = (values) => {
    setSnapshot(values);
    setStepNum((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = (values, formikBag) => {
    if (isLastStep) {
      return onSubmit(values, formikBag);
    } else {
      // trigger validation.
      formikBag.setTouched({});
      handleNext(values);
      formikBag.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={snapshot}
      onSubmit={handleSubmit}
      validationSchema={step.props.validationSchema}
    >
      {(formik) => (
        <Styled.Form>
          {step}
          <Styled.FormButtonContainer>
            {stepNum === 0 ? (
              onCancel && (
                <Styled.FormButton type="button" onClick={onCancel}>
                  Cancel
                </Styled.FormButton>
              )
            ) : (
              <Styled.FormButton
                type="button"
                onClick={() => handleBack(formik.values)}
              >
                Back
              </Styled.FormButton>
            )}
            <Styled.FormButton type="submit" disabled={formik.isSubmitting}>
              {isLastStep ? submitLabel || "Save" : "Next"}
            </Styled.FormButton>
          </Styled.FormButtonContainer>
        </Styled.Form>
      )}
    </Formik>
  );
};

export default MultiStepForm;
