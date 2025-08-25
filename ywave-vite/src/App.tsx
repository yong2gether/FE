import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api';
import { GlobalStyle } from './Styles/GlobalStyle';
import Mobile from './Styles/Mobile';
import AppRouter from './Router';
import { initializeApi } from './api/services';

function App(): React.JSX.Element {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // API 초기화 및 앱 상태 초기화
  useEffect(() => {
    initializeApi();
    
    // hasCompletedCategories가 설정되지 않은 경우 false로 초기화
    if (localStorage.getItem('hasCompletedCategories') === null) {
      localStorage.setItem('hasCompletedCategories', 'false');
    }
  }, []);

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
