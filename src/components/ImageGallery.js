import React, { useState, useEffect, useRef } from 'react';
import './index.css';

function LazyImage({ src, alt, fullSrc, onLoad }) {
  const [isVisible, setIsVisible] = useState(false);
  const [loadTime, setLoadTime] = useState(0);
  const imageRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    });

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, []);

  const handleLoad = () => {
    const endTime = performance.now();
    const startTime = onLoad;
    const imageLoadTime = endTime - startTime;
    setLoadTime(imageLoadTime);
  };

  const handleClick = () => {
    window.open(fullSrc, '_blank');
  };

  return (
    <div style={{ position: 'relative' }}>
      <img
        ref={imageRef}
        src={isVisible ? src : ''}
        alt={alt}
        onClick={handleClick}
        onLoad={handleLoad}
        style={{ cursor: 'pointer' }}
      />
      <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'rgba(255, 255, 255, 0.8)', padding: '2px 5px' }}>
      {loadTime > 0 && `Время загрузки: ${loadTime.toFixed(2)} мс`}
      </div>
    </div>
  );
}

function App() {
  const [images, setImages] = useState([]);
  const [pageLoadTime, setPageLoadTime] = useState(0);

  useEffect(() => {
    fetchImages();
    trackPageLoadTime();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('https://api.unsplash.com/photos/?client_id=2GZF2FZR2G8dgzomDXRjiHMOOjaYj_LQf4_5EKzw6vo');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const trackPageLoadTime = () => {
    const pageLoadStartTime = performance.timing.navigationStart;
    const pageLoadEndTime = performance.now();
    setPageLoadTime(pageLoadEndTime - pageLoadStartTime);
  };

  return (
    <div className="App">
      <PerformanceAnalysis pageLoadTime={pageLoadTime} />
      <div className="image-gallery">
        {Array.isArray(images) && images.map(image => (
          <LazyImage
            key={image.id}
            src={image.urls.thumb}
            alt={image.alt_description}
            fullSrc={image.urls.full}
            onLoad={performance.now()}
          />
        ))}
      </div>
    </div>
  );
}

function PerformanceAnalysis({ pageLoadTime }) {
  return (
    <div className="performance-analysis">
      <h2>Performance Analysis</h2>
      <p>Page Load Time: {pageLoadTime.toFixed(2)} ms</p>
    </div>
  );
}

export default App;
