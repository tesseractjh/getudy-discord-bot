import { createGlobalStyle } from 'styled-components';

const Color = createGlobalStyle`
  :root {
    --color-orange1: #F76E11;
    --color-orange2: #FF9F45;
    --color-orange3: #FFBC80;
    --color-red: #FC4F4F;
    --color-white: #FFFFFF;
    --color-black: #000000;
    --color-black-alpha: rgba(0, 0, 0, 0.5);
    --color-gray1: #777777;
    --color-gray2: #999999;
    --color-gray3: #AAAAAA;
    --color-gray4: #CCCCCC;
    --color-gray5: #EEEEEE;
  }
`;

export default Color;