// guzmanes-frontend/src/components/CalendarView.js
import React, { useState } from 'react';
// Importa las funciones necesarias de date-fns, si no las tienes ya (format, parseISO)
// Aunque tu implementación actual no las usa para los días, sí son útiles para formatear la hora/fecha de las rutas
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale/es'; // <<-- ¡MODIFICADO AQUÍ!

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Asumo que CalendarView recibe ahora también onJoinRoute, onLeaveRoute, onDeleteRoute, y user
// Si no las recibía, asegúrate de pasarlas desde App.js al CalendarView
const CalendarView = ({ routes, onJoinRoute, onLeaveRoute, onDeleteRoute, user }) => {
  console.log('Routes prop in CalendarView:', routes); // DEBUG
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Ajuste para que lunes sea el primer día (0)
  };

  const changeMonth = (increment) => {
    setCurrentDate(new Date(year, month + increment, 1));
  };

  const getRoutesForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    console.log(`Buscando rutas para: ${dateStr}`); // DEBUG
    const filteredRoutes = routes.filter(route => {
      const routeDate = String(route.date);
      console.log(`Comparando ${routeDate} con ${dateStr}`); // DEBUG
      return routeDate === dateStr;
    });
    console.log(`Rutas encontradas para ${dateStr}:`, filteredRoutes); // DEBUG
    return filteredRoutes;
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i + 1);

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => changeMonth(-1)}
          className="px-3 py-1 text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
        >
          &lt;
        </button>
        <h2 className="text-xl font-semibold text-gray-800">
          {months[month]} {year}
        </h2>
        <button
          onClick={() => changeMonth(1)}
          className="px-3 py-1 text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
        >
          &gt;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 p-2">
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
          <div key={day} className="text-center font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="min-h-24 p-1 border border-gray-100 bg-gray-50"></div>
        ))}
        {days.map((day) => {
          const dayRoutes = getRoutesForDay(day);
          const isTodayCell = isCurrentMonth && day === today.getDate(); // Renombrado para evitar conflicto con isToday de date-fns
          return (
            <div
              key={day}
              className={`min-h-24 p-1 border border-gray-100 ${isTodayCell ? 'bg-blue-50' : ''}`}
            >
              <div className={`text-right text-sm font-medium mb-1 ${isTodayCell ? 'text-blue-600 font-bold' : ''}`}>
                {day}
              </div>
              <div className="flex-grow overflow-y-auto mt-1 space-y-1">
                {dayRoutes.map(route => (
                  <div
                    key={route.id}
                    // Añadimos 'group' para el hover, 'cursor-pointer' para la interacción
                    className={`text-xs p-1 mb-1 rounded relative overflow-hidden group cursor-pointer
                                ${route.type === 'carretera' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}
                    title={`${route.name} (${route.time} - ${route.distance}km - ${route.elevation}m)`} // Tooltip al pasar el ratón
                    onClick={() => { // Click para mostrar detalles completos en un alert
                        alert(
                            `Ruta: ${route.name}\n` +
                            `Fecha: ${format(parseISO(route.date), 'dd/MM/yyyy', { locale: es })}\n` +
                            `Hora: ${route.time}\n` +
                            `Tipo: ${route.type}\n` +
                            `Distancia: ${route.distance} km\n` +
                            `Desnivel: ${route.elevation} m\n` +
                            `Track: ${route.trackLink}\n\n` +
                            `Participantes: ${route.participants && route.participants.length > 0 ? route.participants.join(', ') : 'Nadie apuntado'}`
                        );
                    }}
                    onDoubleClick={() => { // Doble click para apuntarse/desapuntarse
                        if (user) { // Solo si hay un usuario logueado
                            if (window.confirm(`¿Quieres ${route.participants.includes(user.username) ? 'desapuntarte' : 'apuntarte'} a la ruta "${route.name}"?`)) {
                                if (route.participants.includes(user.username)) {
                                    onLeaveRoute(route.id, user);
                                } else {
                                    onJoinRoute(route.id, user);
                                }
                            }
                        } else {
                            alert("Necesitas establecer un nombre de usuario para apuntarte o desapuntarte.");
                        }
                    }}
                  >
                    {/* Nombre de la ruta (ahora con control de truncado) */}
                    <span className="font-bold whitespace-nowrap overflow-hidden text-ellipsis block">
                        {route.name}
                    </span>
                    {/* Hora de la ruta */}
                    <span className="text-gray-600 block">
                        {route.time}
                    </span>

                    {/* Botones de acción: Visibles solo en hover del grupo, si hay usuario */}
                    {user && (
                        <div className="absolute inset-0 bg-blue-200 bg-opacity-75 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-1">
                            {!route.participants.includes(user.username) ? (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onJoinRoute(route.id, user); }}
                                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs mx-1"
                                >
                                    Apuntarse
                                </button>
                            ) : (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onLeaveRoute(route.id, user); }}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs mx-1"
                                >
                                    Desapuntarse
                                </button>
                            )}
                            <button
                                onClick={(e) => { e.stopPropagation(); onDeleteRoute(route.id); }}
                                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs mx-1"
                            >
                                Borrar
                            </button>
                        </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;