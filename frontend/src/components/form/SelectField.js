import { useField } from 'formik';

import * as Styled from './SelectField.styles';

const SelectField = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  const isInvalid = meta.touched && meta.error;

  return (
    <Styled.SelectContainer>
      <Styled.Label htmlFor={props.id || props.name}>{label}</Styled.Label>
      <Styled.Select {...field} {...props} isInvalid={isInvalid} />
      {isInvalid ? (
        <Styled.ErrorMessage>{meta.error}</Styled.ErrorMessage>
      ) : null}
    </Styled.SelectContainer>
  );
};

export default SelectField;
