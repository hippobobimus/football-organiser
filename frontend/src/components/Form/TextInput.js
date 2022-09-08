import { useField } from 'formik';
import * as Styled from './TextInput.styles';

export const TextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  const isInvalid = meta.touched && meta.error;

  return (
    <Styled.InputContainer>
      <Styled.Label htmlFor={props.id || props.name}>{label}</Styled.Label>
      <Styled.Input {...field} {...props} isInvalid={isInvalid} />
      {isInvalid ? (
        <Styled.ErrorMessage name={props.name}>
          {meta.error}
        </Styled.ErrorMessage>
      ) : null}
    </Styled.InputContainer>
  );
};
