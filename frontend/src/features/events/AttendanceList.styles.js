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
