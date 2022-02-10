import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import Color from './style/Color';
import FontStyle from "./style/FontStyle";
import ResetStyle from "./style/ResetStyle";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ResetStyle />
      <Color />
      <FontStyle />
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/admin" element={<Home />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
