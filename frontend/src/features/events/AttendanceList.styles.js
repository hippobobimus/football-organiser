import styled from 'styled-components';

export const List = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: minmax(10px, max-content);
  gap: 5px;
  width: 95%;
  height: 230px;
`;

export const AttendanceTotal = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  font-family: ${(props) => props.theme.subtitleFont};
  font-size: 1.2rem;
`;
