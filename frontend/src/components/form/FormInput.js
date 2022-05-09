import { useState } from 'react';
import * as Styled from './FormInput.styles';

const FormInput = (props) => {
  const { label, errorMessage, ...inputProps } = props;
  const [visited, setVisited] = useState();

  const handleBlur = (e) => {
    // visited state is applied after an input is left for the first time
    // so that formatting related to input validation can be hidden initially.
    setVisited(true);
  };

  return (
    <Styled.InputContainer>
      <Styled.FormLabel htmlFor={inputProps.id}>{label}</Styled.FormLabel>
      <Styled.Input visited={visited} onBlur={handleBlur} {...inputProps} />
      <Styled.ErrorMessage>{errorMessage}</Styled.ErrorMessage>
    </Styled.InputContainer>
  );
};

export default FormInput;
