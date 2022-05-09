import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  position: relative;
  width: ${(props) => props.size};
  height: ${(props) => props.size};
`

const AnimatedSpinner = styled.div`
  border: calc(${(props) => props.size} / 6) solid ${(props) => props.theme.spinnerBgClr};
  border-top: calc(${(props) => props.size} / 6) solid ${(props) => props.theme.spinnerFgClr};
  border-radius: 50%;
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  animation: ${spin} 2s linear infinite;
  position: absolute;
  top: 0;
  bottom: 0;
  z-index:999;
`;

const SpinnerShadow = styled.div`
  border: calc(${(props) => props.size} / 6) solid ${(props) => props.theme.spinnerBgClr};
  border-radius: 50%;
  box-shadow: 3px 3px 2px ${(props) => props.theme.boxShadowClr},
    inset 3px 3px 2px ${(props) => props.theme.boxShadowClr};
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 998;
`;

export { SpinnerContainer, AnimatedSpinner, SpinnerShadow };
