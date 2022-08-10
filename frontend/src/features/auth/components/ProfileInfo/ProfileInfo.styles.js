import styled from 'styled-components';

import { Button, Container } from '../../../../components/styles';

export const HeadingContainer = styled(Container)`
  flex-direction: row;
  gap: 10px;
`;

export const SectionContainer = styled(Container)`
  gap: 10px;
`;

export const SmallButton = styled(Button)`
  padding: 0px 10px;
`;

export const List = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 150px;
`;

export const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  gap: 5px;
`;
