import { createGlobalStyle } from 'styled-components';
import SUIT from '../assets/fonts/SUIT-Variable.woff2';

const FontStyle = createGlobalStyle`
  @font-face {
	  font-family: 'SUIT Variable';
	  font-weight: 100 900;
	  src: url(${SUIT}) format('woff2-variations');
  }

  html, * {
    font-family: 'SUIT Variable', sans-serif;
    color: var(--color-black);
  }
`;

export default FontStyle;