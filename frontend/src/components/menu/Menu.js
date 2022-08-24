import * as Styled from './Menu.styles';
import uniqid from 'uniqid';

export const Menu = ({ items, isRow }) => {
  const elements = items.map((item) => (
    <Styled.ListItem key={item.uid || uniqid()}>
      <Styled.MenuNavLink to={item.path}>{item.text}</Styled.MenuNavLink>
    </Styled.ListItem>
  ));

  return <Styled.MenuList isRow={isRow}>{elements}</Styled.MenuList>;
};

export default Menu;
