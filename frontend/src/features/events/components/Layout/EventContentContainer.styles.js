import styled from 'styled-components';

export const NavContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 5px;
  border-bottom: 2px solid black;
  background-color: ${(props) => props.theme.eventContentNavBgClr};
  border-radius: 25px 25px 0 0;
  box-shadow: 3px 3px 2px ${(props) => props.theme.boxShadowClr};
`;

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 320px;
  background-color: ${(props) => props.theme.eventContentBgClr};
  border-radius: 25px;
  box-shadow: 3px 3px 2px ${(props) => props.theme.boxShadowClr};
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
