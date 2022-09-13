import styled from 'styled-components';

import { AnimatedContainer } from '../Container';

const FormStepContainer = styled(AnimatedContainer)`
  width: 100%;
`;

const formStepVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

export const FormStep = ({ children }) => {
  return (
    <FormStepContainer
      variants={formStepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </FormStepContainer>
  );
};
