import React, { useState, useEffect } from 'react';
import PerformanceAnalysis from './components/Performance';
import ImageGallery from './components/ImageGallery';

const App = () => {
  const [pageLoadTime, setPageLoadTime] = useState(0);

  useEffect(() => {
    trackPageLoadTime();
  }, []);

  const trackPageLoadTime = () => {
    const pageLoadStartTime = performance.timing.navigationStart;
    const pageLoadEndTime = performance.now();
    setPageLoadTime(pageLoadEndTime - pageLoadStartTime);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Image Gallery</h1>
      </header>
      <main>
        <PerformanceAnalysis pageLoadTime={pageLoadTime} />
        <ImageGallery />
      </main>
    </div>
  );
};

export default App;

