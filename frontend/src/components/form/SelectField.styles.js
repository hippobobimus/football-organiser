import styled from "styled-components";

export const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const Label = styled.label`
  font-size: 1rem;
`;

export const ErrorMessage = styled.div`
  background-color: ${(props) => props.theme.errorBgClr};
  color: ${(props) => props.theme.errorTextClr};
  font-size: 0.8rem;
  border-radius: 5px;
  box-shadow: 3px 3px 2px ${(props) => props.theme.boxShadowClr};
  padding: 5px;
  margin-top: 3px;
`;

export const Select = styled.select`
  border-radius: 5px;
  border: 1px solid
    ${(props) =>
      props.isInvalid
        ? props.theme.inputErrorBorderClr
        : props.theme.inputBorderClr};
  padding: 5px;
  width: 100%;
`;
