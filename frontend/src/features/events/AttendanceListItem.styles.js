import styled from "styled-components";
import MdiIcon from "@mdi/react";

export const ListItem = styled.li`
  background-color: ${(props) => props.theme.playerListBgClr};
  border-radius: 5px;
  box-shadow: 3px 3px 2px ${(props) => props.theme.boxShadowClr};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  width: 100%;
  overflow: hidden;
`;

export const Content = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0px 0px 0px 0px;
  padding-top: 4px;
  font-size: 0.7rem;
`;

export const IconContainer = styled.div`
  justify-content: center;
  align-items: center;
  display: none;
  gap: 3px;

  &:hover {
    cursor: pointer;
  }

  ${ListItem}:hover & {
    display: flex;
  }
`;

export const Icon = styled(MdiIcon)`
  vertical-align: -100px;

  &:hover {
    transform: translate(-0px, -2px);
  }

  &:active {
    transform: none;
  }
`;
