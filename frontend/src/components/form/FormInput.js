import * as Styled from './FormInput.styles';

const FormInput = (props) => {
  const { label, errorMessage, ...inputProps } = props;

  return (
    <Styled.InputContainer>
      <Styled.FormLabel htmlFor={inputProps.id}>{label}</Styled.FormLabel>
      <Styled.Input {...inputProps} />
      <Styled.ErrorMessage>{errorMessage}</Styled.ErrorMessage>
    </Styled.InputContainer>
  );
};

export default FormInput;
