import { Menu } from '../../../../components/menu/Menu.js';
import * as Styled from './styles';

const TabsNav = ({ items }) => {
  return (
    <Styled.TabsNavContainer>
      <Menu items={items} isRow />
    </Styled.TabsNavContainer>
  );
};

export const Tabs = ({ children, navItems }) => {
  return (
    <Styled.ContentCard>
      <TabsNav items={navItems} />
      <Styled.TabBodyContainer>{children}</Styled.TabBodyContainer>
    </Styled.ContentCard>
  );
};
