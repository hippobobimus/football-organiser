import styled from "styled-components";

export const SummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
  margin-bottom: 20px;
`;

export const GuestsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 5px;
`;

export const Status = styled.h3`
  font-family: ${(props) => props.theme.subtitleFont};
`;
