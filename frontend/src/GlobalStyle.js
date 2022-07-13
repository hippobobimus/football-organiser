const { createGlobalStyle } = require('styled-components');

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    background-color: ${(props) => props.theme.bgClr};
    height: 100%;
    font-family: ${(props) => props.theme.font};
    color: ${(props) => props.theme.textClr};
  }

  a {
    color: ${(props) => props.theme.textClr};
    text-decoration: none;
  }

  #root {
    height: 100%;
    display: grid;
    grid-template-rows: auto 1fr;
  }
`;

export default GlobalStyle;
