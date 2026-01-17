import React from 'react';
import { ColorRing } from 'react-loader-spinner';

const Loader = ({ height = "80", width = "80", className = "flex justify-center items-center h-screen" }) => {
  return (
    <div className={className}>
      <ColorRing
        visible={true}
        height={height}
        width={width}
        ariaLabel="color-ring-loading"
        wrapperStyle={{}}
        wrapperClass="color-ring-wrapper"
        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
      />
    </div>
  );
};

export default Loader;

