import styled from 'styled-components';

export const ListItem = styled.li`
  background-color: ${(props) => props.theme.playerListBgClr};
  border-radius: 5px;
  box-shadow: 3px 3px 2px ${(props) => props.theme.boxShadowClr};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 10px 5px 10px;
  font-size: 0.7rem;
`;
