// src/components/RouteForm.js
import React, { useState } from 'react';

const RouteForm = ({ onAddRoute }) => {
  const [routeData, setRouteData] = useState({
    name: '',
    date: '',
    type: 'carretera',
    distance: '',
    elevation: '',
    trackLink: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRouteData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddRoute(routeData);
    setRouteData({
      name: '',
      date: '',
      type: 'carretera',
      distance: '',
      elevation: '',
      trackLink: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Registrar nueva ruta</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Nombre de la ruta</label>
          <input
            type="text"
            name="name"
            value={routeData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Fecha</label>
          <input
            type="date"
            name="date"
            value={routeData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Tipo de ruta</label>
          <select
            name="type"
            value={routeData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="carretera">Carretera</option>
            <option value="mtb">MTB</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Distancia (km)</label>
          <input
            type="number"
            name="distance"
            value={routeData.distance}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Desnivel (m)</label>
          <input
            type="number"
            name="elevation"
            value={routeData.elevation}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Enlace a track (Strava/Wikiloc)</label>
          <input
            type="url"
            name="trackLink"
            value={routeData.trackLink}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Añadir Ruta
      </button>
    </form>
  );
};

export default RouteForm;