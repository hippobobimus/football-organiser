import styled from "styled-components";
import { Form as FormikForm } from "formik";

import { Button } from "../styles";

export const Form = styled(FormikForm)`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: min(300px, 95%);
`;

export const FormButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

export const FormButton = styled(Button)`
  width: 100px;
  padding: 8px;
`;
