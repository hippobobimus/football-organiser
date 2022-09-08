import styled from 'styled-components';
import Icon from '@mdi/react';

import { Button } from '../../../../components/styles';

export const IconContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 5px;
  width: 60px;
`;

export const ListItemButton = styled(Button)`
  font-family: ${(props) => props.theme.font};
  font-size: 0.9rem;
  width: 100%;
  height: 75px;
`;

export const FieldsList = styled.ul`
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

export const Field = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  vertical-align: center;
`;

export const DateField = styled(Field)`
  font-size: 0.85rem;
  width: 70px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const TimeField = styled(Field)`
  width: 55px;
`;

export const NameField = styled(Field)`
  text-align: center;
  width: 25%;
  min-width: 80px;
  overflow-wrap: break-word;
`;

export const AttendeesField = styled(Field)`
  width: 35px;
`;

export const UserAttendanceField = styled(Field)`
  width: 20px;
`;

export const FieldIcon = styled(Icon)`
  margin-top: -6px;
`;
