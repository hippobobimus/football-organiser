import * as Styled from "./Menu.styles";

function Menu({ items, isRow }) {
  const elements = items.map((item) => (
    <Styled.ListItem key={item.uid}>
      <Styled.MenuNavLink to={item.path}>{item.text}</Styled.MenuNavLink>
    </Styled.ListItem>
  ));

  return <Styled.MenuList isRow={isRow}>{elements}</Styled.MenuList>;
}

export default Menu;
