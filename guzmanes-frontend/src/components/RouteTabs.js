// guzmanes-frontend/src/components/RouteTabs.js
import React, { useState } from 'react';
import CalendarView from './CalendarView';
import RouteCard from './RouteCard';
// import { format, parseISO } from 'date-fns'; // <-- ¡¡¡ELIMINADAS ESTAS IMPORTACIONES!!!

// Asegúrate de que RouteTabs recibe la prop 'onUpdate'
const RouteTabs = ({ routes = [], onDelete, onJoin, onLeave, onUpdate, user }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const today = new Date().toISOString().split('T')[0];

  const upcomingRoutes = Array.isArray(routes)
    ? [...routes]
        .filter(route => route.date >= today)
        .sort((a, b) => {
            // Ordenar primero por fecha y luego por hora
            const dateA = new Date(a.date + 'T' + (a.time || '00:00')); // Usa '00:00' si la hora no existe
            const dateB = new Date(b.date + 'T' + (b.time || '00:00'));
            return dateA.getTime() - dateB.getTime();
        })
    : [];

  const pastRoutes = Array.isArray(routes)
    ? [...routes]
        .filter(route => route.date < today)
        .sort((a, b) => {
            // Ordenar primero por fecha y luego por hora (descendente para las pasadas)
            const dateA = new Date(a.date + 'T' + (a.time || '00:00'));
            const dateB = new Date(b.date + 'T' + (b.time || '00:00'));
            return dateB.getTime() - dateA.getTime(); // Orden descendente para rutas pasadas
        })
    : [];

  return (
    <div className="mt-8">
      <div className="flex border-b border-gray-200">
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === 'upcoming'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('upcoming')}
        >
          Próximas rutas
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === 'past'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('past')}
        >
          Rutas completadas
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === 'calendar'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('calendar')}
        >
          Calendario
        </button>
      </div>

      <div className="mt-4">
        {activeTab === 'upcoming' && (
          upcomingRoutes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingRoutes.map(route => (
                <RouteCard
                  key={route.id}
                  route={route}
                  onDelete={onDelete}
                  onJoin={onJoin}
                  onLeave={onLeave}
                  onUpdate={onUpdate}
                  user={user}
                  isPast={false}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No hay rutas programadas</p>
          )
        )}

        {activeTab === 'past' && (
          pastRoutes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastRoutes.map(route => (
                <RouteCard
                  key={route.id}
                  route={route}
                  onDelete={onDelete}
                  onJoin={onJoin}
                  onLeave={onLeave}
                  onUpdate={onUpdate}
                  user={user}
                  isPast={true}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No hay rutas completadas</p>
          )
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            routes={Array.isArray(routes) ? routes : []}
            onDeleteRoute={onDelete}
            onJoinRoute={onJoin}
            onLeaveRoute={onLeave}
            user={user}
            // onUpdate también podría pasarse aquí si quieres habilitar la edición desde el calendario
            // onUpdateRoute={onUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default RouteTabs;