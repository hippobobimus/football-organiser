import styled from 'styled-components';

const ListItem = styled.li`
  display: flex;
  align-items: center;

  font-family: ${(props) => props.theme.subtitleFont};
  font-size: 1.5rem;
  text-decoration: none;
`;

const MenuList = styled.ul`
  display: flex;
  flex-direction: ${(props) => props.isRow ? 'row' : 'column'};
  align-items: center;
  gap: 15px;

  list-style: none;
`;

export { ListItem, MenuList };
