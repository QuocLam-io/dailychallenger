import React from "react";
import "./CarraigeLoader.scss";

const CarraigeLoader: React.FC = () => {
  return (
    <div className="carraige-loader-wrapper">
      <img src="/src/assets/carraige.gif" alt="carraige" />
      <img src="/src/assets/carraige.gif" alt="carraige" />

      <div className="carraige-text-wrapper">
        <div className="carraige-text-wrapper-item">
          Clip, clop, clip, clop...
        </div>
        <div className="carraige-text-wrapper-item">
          By Jove, hold your horses!
        </div>
        <div className="carraige-text-wrapper-item">
          Patience, good fellow. Patience.
        </div>
        <div className="carraige-text-wrapper-item">
          Clip, clop, clip, clop...
        </div>
        <div className="carraige-text-wrapper-item">
          By Jove, hold your horses!
        </div>
        <div className="carraige-text-wrapper-item">
          Patience, good fellow. Patience.
        </div>
      </div>
    </div>
  );
};

export default CarraigeLoader;
