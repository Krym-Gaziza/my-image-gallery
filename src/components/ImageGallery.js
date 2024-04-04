import React, { useState, useEffect, useRef } from 'react';
import './index.css';

const preloadImage = (src) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
};

function LazyImage({ src, alt, fullSrc, onLoad }) {
  const [isVisible, setIsVisible] = useState(false);
  const [loadTime, setLoadTime] = useState(0);
  const imageRef = useRef(null);

  useEffect(() => {
    const currentImageRef = imageRef.current; 
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    });
  
    if (currentImageRef) {
      observer.observe(currentImageRef);
    }
    return () => {
      if (currentImageRef) {
        observer.unobserve(currentImageRef); 
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
    <div className="lazy-image-container">
      <img
        ref={imageRef}
        src={isVisible ? src : ''}
        alt={alt}
        onClick={handleClick}
        onLoad={handleLoad}
        className="lazy-image"
      />
      {loadTime > 0 && (
        <div className="load-time-indicator">
          Время загрузки: <strong>{loadTime.toFixed(2)} мс</strong>
        </div>
      )}
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


      data.slice(0, 5).forEach(image => preloadImage(image.urls.thumb));
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


export default App;
