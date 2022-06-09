import styled from 'styled-components';

export const InfoContainer = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.infoBarBgClr};
  border-radius: 25px;
  box-shadow: 3px 3px 2px ${(props) => props.theme.boxShadowClr};
  padding: 10px;
`;

export const InfoList = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

export const Status = styled.div`
  font-family: ${(props) => props.theme.subtitleFont};
  color: ${(props) => props.theme.alertTextClr};
  font-size: 1.5rem;
  text-shadow: 0px 5px 2px ${(props) => props.theme.infoBarTextShadowClr};
`;

export const InfoEntry = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3px;
  margin: 0 10px;
`;

export const InfoText = styled.span`
  padding-top: 5px;
  font-weight: bold;
  font-size: 0.9rem;
`;
