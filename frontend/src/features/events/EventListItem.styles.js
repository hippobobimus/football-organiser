import styled from 'styled-components';
import Icon from '@mdi/react';

export const ListItem = styled.li`
  background-color: ${(props) => props.theme.listItemBgClr};
  border-radius: 5px;
  box-shadow: 3px 3px 2px ${(props) => props.theme.boxShadowClr};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 15px 5px 15px;
  font-size: 0.9rem;
  width: 100%;
  height: 75px;
`;

export const FieldsList = styled.ul`
  list-style: none;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
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
  width: 80px;
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
