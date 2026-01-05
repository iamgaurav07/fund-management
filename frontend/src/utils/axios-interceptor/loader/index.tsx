/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import './loader.css';

const Loader: React.FunctionComponent<any> = () => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
    </div>
  );
};

export default Loader;
