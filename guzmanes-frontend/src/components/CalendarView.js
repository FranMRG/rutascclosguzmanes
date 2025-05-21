// guzmanes-frontend/src/components/CalendarView.js
import React, { useState } from 'react';

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const CalendarView = ({ routes }) => {
  console.log('Routes prop in CalendarView:', routes); // DEBUG
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    // getDay() devuelve 0 para domingo, 1 para lunes, etc.
    // Queremos que el lunes sea el primer día (índice 0 en nuestra cuadrícula).
    // Por lo tanto, si es domingo (0), lo convertimos a 6. Si es otro día, le restamos 1.
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
      // Asegúrate de que route.date exista y sea una cadena
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
          const isToday = isCurrentMonth && day === today.getDate();
          return (
            <div
              key={day}
              className={`min-h-24 p-1 border border-gray-100 ${isToday ? 'bg-blue-50' : ''}`}
            >
              <div className={`text-right text-sm font-medium mb-1 ${isToday ? 'text-blue-600 font-bold' : ''}`}>
                {day}
              </div>
              {dayRoutes.map(route => (
                <div
                  key={route.id}
                  className={`text-xs p-1 mb-1 rounded truncate ${route.type === 'carretera' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}
                >
                  {route.name}
                  {/* Aquí podrías añadir los participantes si los necesitas mostrar también en el calendario */}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;