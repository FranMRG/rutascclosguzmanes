// guzmanes-frontend/src/components/RouteCard.js
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns'; // Necesario para parsear y formatear fechas

// Asegúrate de que onUpdate se recibe como prop
const RouteCard = ({ route, onDelete, onJoin, onLeave, onUpdate, isPast }) => {
  const [password, setPassword] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false); // Nuevo estado para controlar la visibilidad del formulario de edición

  // Estados para el formulario de edición, inicializados con los datos de la ruta actual
  const [editName, setEditName] = useState(route.name);
  const [editDate, setEditDate] = useState(route.date);
  const [editTime, setEditTime] = useState(route.time);
  const [editType, setEditType] = useState(route.type);
  const [editDistance, setEditDistance] = useState(route.distance);
  const [editElevation, setEditElevation] = useState(route.elevation);
  const [editTrackLink, setEditTrackLink] = useState(route.trackLink || ''); // Asegura que no sea null

  const today = new Date().toISOString().split('T')[0];
  const isCompleted = isPast || route.date < today;

  // Asegurarse de que currentParticipants sea siempre un array
  let currentParticipants = [];
  if (route.participants_json) {
    try {
      currentParticipants = JSON.parse(route.participants_json);
      if (!Array.isArray(currentParticipants)) {
        currentParticipants = [];
      }
    } catch (error) {
      console.error("Error parsing participants_json for route:", route.id, error);
      currentParticipants = [];
    }
  } else if (route.participants && Array.isArray(route.participants)) {
    currentParticipants = route.participants;
  }

  const handleDelete = async () => {
    if (password === '123admin') { // Contraseña para borrar
      await onDelete(route.id);
      setPassword('');
      setShowPasswordField(false);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  // --- NUEVA FUNCIÓN PARA MANEJAR LA EDICIÓN ---
  const handleEditSubmit = async (e) => {
    e.preventDefault(); // Prevenir el envío por defecto del formulario
    if (password === '123admin') { // Misma contraseña que para borrar
      const updatedRouteData = {
        name: editName,
        date: editDate,
        time: editTime,
        type: editType,
        distance: Number(editDistance), // Asegurarse de que sean números
        elevation: Number(editElevation),
        trackLink: editTrackLink,
        // No enviamos participants_json aquí, lo gestiona el backend
        // Ni el ID, que se pasa por la URL
      };
      await onUpdate(route.id, updatedRouteData); // Llamar a la función de App.js (onUpdate)
      setShowEditForm(false); // Ocultar el formulario después de guardar
      setPassword(''); // Limpiar contraseña
    } else {
      alert('Contraseña incorrecta para modificar');
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
            <p className="text-gray-500 text-sm">Hora: {route.time}</p> {/* Añadido hora */}
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

          {/* ¡¡¡NUEVO BOTÓN MODIFICAR!!! */}
          <button
            onClick={() => {
              setShowEditForm(!showEditForm); // Alternar visibilidad del formulario de edición
              // Ocultar el campo de contraseña de borrar si está abierto y limpiar la contraseña
              if (showPasswordField) setShowPasswordField(false);
              setPassword('');
            }}
            className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
          >
            {showEditForm ? 'Cancelar Edición' : 'Modificar ruta'}
          </button>

          {/* Botón de Borrar Ruta */}
          <button
            onClick={() => {
              setShowPasswordField(!showPasswordField); // Alternar visibilidad del campo de contraseña de borrar
              // Ocultar el formulario de edición si está abierto y limpiar la contraseña
              if (showEditForm) setShowEditForm(false);
              setPassword('');
            }}
            className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
          >
            Borrar ruta
          </button>
        </div>

        {/* Formulario de edición (visible cuando showEditForm es true) */}
        {showEditForm && (
          <form onSubmit={handleEditSubmit} className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
            <h4 className="text-lg font-semibold mb-3 text-gray-700">Modificar Ruta</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Campos del formulario, similares a RouteForm */}
              <label className="block">
                <span className="text-gray-700 text-sm">Nombre:</span>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm"
                  required
                />
              </label>
              <label className="block">
                <span className="text-gray-700 text-sm">Fecha:</span>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm"
                  required
                />
              </label>
              <label className="block">
                <span className="text-gray-700 text-sm">Hora:</span>
                <input
                  type="time"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm"
                  required
                />
              </label>
              <label className="block">
                <span className="text-gray-700 text-sm">Tipo:</span>
                <select
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm"
                  required
                >
                  <option value="carretera">Carretera</option>
                  <option value="mtb">MTB</option>
                </select>
              </label>
              <label className="block">
                <span className="text-gray-700 text-sm">Distancia (km):</span>
                <input
                  type="number"
                  value={editDistance}
                  onChange={(e) => setEditDistance(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm"
                  required
                />
              </label>
              <label className="block">
                <span className="text-gray-700 text-sm">Desnivel (m):</span>
                <input
                  type="number"
                  value={editElevation}
                  onChange={(e) => setEditElevation(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm"
                  required
                />
              </label>
              <label className="block md:col-span-2">
                <span className="text-gray-700 text-sm">Enlace Track (opcional):</span>
                <input
                  type="url"
                  value={editTrackLink}
                  onChange={(e) => setEditTrackLink(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm"
                />
              </label>
            </div>
            <div className="mt-4">
              <label className="block">
                <span className="text-gray-700 text-sm">Contraseña de admin:</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña para modificar"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm"
                  required
                />
              </label>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        )}

        {/* Campo de contraseña para borrar (visible cuando showPasswordField es true) */}
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

        {currentParticipants && currentParticipants.length > 0 && (
          <div className="mt-3">
            <p className="text-sm text-gray-500">Participantes: {currentParticipants.join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteCard;