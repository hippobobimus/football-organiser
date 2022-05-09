import styled from 'styled-components';

import { Container } from '../../components/styles';

const InputContainer = styled(Container)`
  align-items: flex-start;
`;

const FormLabel = styled.label`
  font-size: 1rem;
`;

const ErrorMessage = styled.div`
  background-color: ${(props) => props.theme.errorBgClr};
  color: ${(props) => props.theme.errorTextClr};
  font-size: 0.8rem;
  border-radius: 5px;
  box-shadow: 3px 3px 2px ${(props) => props.theme.boxShadowClr};
  padding: 5px;
  margin-top: 3px;
  display: none;
`;

const Input = styled.input`
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.inputBorderClr};
  padding: 5px;
  width: 100%;

  ${(props) =>
    props.visited &&
    `
    &:invalid {
      border: 2px solid ${props.theme.inputErrorBorderClr};
    }

    &:invalid + ${ErrorMessage} {
      display: block;
    }
  `}
`;

export { ErrorMessage, FormLabel, Input, InputContainer };
