import * as Styled from './Form.styles';
import { Button } from '../styles';
import FormInput from './FormInput';

const Form = ({ inputs, onSubmit }) => {
  return (
    <Styled.Form onSubmit={onSubmit}>
      {inputs.map((input) => (
        <FormInput {...input} />
      ))}

      <Button>Submit</Button>
    </Styled.Form>
  );
};

export default Form;
