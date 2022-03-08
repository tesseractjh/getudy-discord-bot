import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Home from './pages/Home';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import Color from './style/Color';
import FontStyle from './style/FontStyle';
import ResetStyle from './style/ResetStyle';

export const GlobalContext = React.createContext(null);

const App = () => {
  const [context, setContext] = useState(null);
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/context');
      const json = await res.json();
      setContext(json);
    })();
  }, []);

  return (
    <GlobalContext.Provider value={context}>
      <Helmet>
        <title>{context?.BOT_NAME ?? '디스코드 봇'}</title>
      </Helmet>
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
    </GlobalContext.Provider>
  );
};

export default App;