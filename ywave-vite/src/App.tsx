import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api';
import { GlobalStyle } from './Styles/GlobalStyle';
import Mobile from './Styles/Mobile';
import AppRouter from './Router';

function App(): React.JSX.Element {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={["places"]}
      language="ko"
      region="KR"
      version="weekly"
    >
      <GlobalStyle />
      <Router>
        <Mobile>
          <AppRouter />
        </Mobile>
      </Router>
    </LoadScript>
  );
}

export default App;
