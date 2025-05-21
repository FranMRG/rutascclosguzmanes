// src/components/RouteCard.js
import React, { useState } from 'react';

const RouteCard = ({ route, onDelete, onJoin, onLeave, isPast }) => {
  const [password, setPassword] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const isCompleted = isPast || route.date < today;

  const handleDelete = async () => {
    if (password === '123admin') {
      await onDelete(route.id);
      setPassword('');
      setShowPasswordField(false);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{route.name}</h3>
            <p className="text-gray-600">
              {new Date(route.date).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="text-gray-500 text-sm">Distancia: {route.distance} km</p>
            <p className="text-gray-500 text-sm">Desnivel: {route.elevation} m</p>
            {route.trackLink && (
              <a
                href={route.trackLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-sm"
              >
                Ver track
              </a>
            )}
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            route.type === 'carretera' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
          }`}>
            {route.type === 'carretera' ? 'Carretera' : 'MTB'}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {!isCompleted ? (
            <>
              <button
                onClick={() => onJoin(route.id)}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Apuntarse
              </button>
              <button
                onClick={() => onLeave(route.id)}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Borrarse
              </button>
            </>
          ) : (
            <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded">Ruta completada</span>
          )}

          <button
            onClick={() => setShowPasswordField(!showPasswordField)}
            className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
          >
            Borrar ruta
          </button>
        </div>

        {showPasswordField && (
          <div className="mt-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña de admin"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
            />
            <button
              onClick={handleDelete}
              className="mt-2 w-full bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 transition-colors text-sm"
            >
              Confirmar borrado
            </button>
          </div>
        )}

        {route.participants && Array.isArray(route.participants) && route.participants.length > 0 && (
          <div className="mt-3">
            <p className="text-sm text-gray-500">Participantes: {route.participants.join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteCard;