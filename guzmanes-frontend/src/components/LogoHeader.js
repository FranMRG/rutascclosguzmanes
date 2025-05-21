// src/components/LogoHeader.js
import React from 'react';

const LogoHeader = () => {
  return (
    <div className="flex flex-col items-center justify-center mb-8">
      <img
        src="https://4tsix0yujj.ufs.sh/f/2vMRHqOYUHc0Ve2g1tJrFC0J7K5LhXEI2tlBemYwSTjsNOpD"
        alt="Logo Club Ciclista Los Guzmanes"
        className="w-32 h-32 object-contain"
      />
      <h1 className="text-3xl font-bold text-gray-900 mt-4">Rutas Club Ciclista Los Guzmanes</h1>
      <p className="text-lg text-gray-600">Tus rutas siempre disponibles</p>
    </div>
  );
};

export default LogoHeader;