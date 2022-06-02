import React, { useState } from 'react';
import { Formik } from 'formik';

import Form from './Form';
import FormButtonContainer from './FormButtonContainer';
import FormButton from './FormButton';

const MultiStepForm = ({ children, initialValues, onSubmit, onCancel }) => {
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
        <Form>
          {step}
          <FormButtonContainer>
            {stepNum === 0 ? (
              <FormButton type='button' onClick={onCancel}>
                Cancel
              </FormButton>
            ) : (
              <FormButton
                type='button'
                onClick={() => handleBack(formik.values)}
              >
                Back
              </FormButton>
            )}
            <FormButton type='submit' disabled={formik.isSubmitting}>
              {isLastStep ? 'Save' : 'Next'}
            </FormButton>
          </FormButtonContainer>
        </Form>
      )}
    </Formik>
  );
};

export default MultiStepForm;
