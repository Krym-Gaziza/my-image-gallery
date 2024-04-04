import React from 'react';

function PerformanceAnalysis({ pageLoadTime }) {
  return (
    <div className="performance-analysis">
      <h2>Performance Analysis</h2>
      <p>Page Load Time: {Math.abs(pageLoadTime).toFixed(2)} ms</p>
    </div>
  );
}

export default PerformanceAnalysis;
