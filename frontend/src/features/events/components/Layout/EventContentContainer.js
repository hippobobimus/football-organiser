import { Menu } from '../../../../components/menu/Menu.js';
import * as Styled from './EventContentContainer.styles';

const EventContentNav = ({ items }) => {
  return (
    <Styled.NavContainer>
      <Menu items={items} isRow />
    </Styled.NavContainer>
  );
};

export const EventContentContainer = ({ children, navItems }) => {
  return (
    <Styled.MainContainer>
      <EventContentNav items={navItems} />
      <Styled.ContentContainer>{children}</Styled.ContentContainer>
    </Styled.MainContainer>
  );
};
