import styled from 'styled-components';
import { Form as FormikForm } from 'formik';

const Form = styled(FormikForm)`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: min(300px, 95%);
`;

export default Form;
