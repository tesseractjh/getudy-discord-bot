import React from 'react';
import ReactDOM from 'react-dom';
import Home from './pages/Home';
import Color from './style/Color';
import FontStyle from "./style/FontStyle";
import ResetStyle from "./style/ResetStyle";

ReactDOM.render(
  <React.StrictMode>
    <ResetStyle />
    <Color />
    <FontStyle />
    <Home />
  </React.StrictMode>,
  document.getElementById('root')
);
