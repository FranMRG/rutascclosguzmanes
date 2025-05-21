// src/components/RouteTabs.js
import React, { useState } from 'react';
import CalendarView from './CalendarView';
import RouteCard from './RouteCard';

const RouteTabs = ({ routes = [], onDelete, onJoin, onLeave }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const today = new Date().toISOString().split('T')[0];

  const upcomingRoutes = Array.isArray(routes)
    ? [...routes]
        .filter(route => route.date >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
    : [];

  const pastRoutes = Array.isArray(routes)
    ? [...routes]
        .filter(route => route.date < today)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
    : [];

  return (
    <div className="mt-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4">
          {['upcoming', 'past', 'calendar'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 font-medium text-sm ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'upcoming' && 'Próximas Rutas'}
              {tab === 'past' && 'Rutas Pasadas'}
              {tab === 'calendar' && 'Calendario'}
            </button>
          ))}
        </nav>
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
                  isPast={true}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No hay rutas completadas</p>
          )
        )}

        {activeTab === 'calendar' && <CalendarView routes={Array.isArray(routes) ? routes : []} />}
      </div>
    </div>
  );
};

export default RouteTabs;