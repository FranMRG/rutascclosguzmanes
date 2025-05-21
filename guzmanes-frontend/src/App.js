// guzmanes-frontend/src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import LogoHeader from './components/LogoHeader';
import RouteForm from './components/RouteForm';
import RouteTabs from './components/RouteTabs';
import Footer from './components/Footer';
import UserSetup from './components/UserSetup';
import { getRoutes, addRoute, deleteRoute, joinRoute, leaveRoute, setCurrentUser as setRemoteUser } from './utils/storage';

const App = () => {
  const [routes, setRoutes] = useState([]);
  const [currentUser, setCurrentUser] = useState('');

  const loadRoutes = useCallback(async () => {
    console.log("Cargando rutas...");
    const loadedRoutes = await getRoutes(); // Esta ahora obtiene del backend
    console.log("Rutas cargadas:", loadedRoutes);
    setRoutes(loadedRoutes);
  }, []);

  useEffect(() => {
    loadRoutes();
  }, [loadRoutes]);

  const handleSetCurrentUser = async (username) => {
    setCurrentUser(username);
    await setRemoteUser(username); // Sincroniza con el backend
  };

  const handleAddRoute = async (newRoute) => {
    const updatedRoutes = await addRoute(newRoute); // addRoute ya recarga las rutas del backend
    setRoutes(updatedRoutes);
  };

  const handleDeleteRoute = async (id) => {
    const updatedRoutes = await deleteRoute(id); // deleteRoute ya recarga las rutas del backend
    setRoutes(updatedRoutes);
  };

  const handleJoinRoute = async (routeId) => {
    if (!currentUser) {
      alert('Por favor, ingresa tu nombre de ciclista primero.');
      return;
    }
    console.log(`Intentando unirse a la ruta ${routeId} con el usuario ${currentUser}`);
    const updatedRoutes = await joinRoute(routeId, { username: currentUser }); // Pasa el usuario como un objeto
    setRoutes(updatedRoutes); // Actualiza el estado con las rutas recargadas
    console.log("Rutas recargadas después de unirse.");
  };

  const handleLeaveRoute = async (routeId) => {
    if (!currentUser) {
      alert('Por favor, ingresa tu nombre de ciclista primero.');
      return;
    }
    console.log(`Intentando borrarse de la ruta ${routeId} con el usuario ${currentUser}`);
    const updatedRoutes = await leaveRoute(routeId, { username: currentUser }); // Pasa el usuario como un objeto
    setRoutes(updatedRoutes); // Actualiza el estado con las rutas recargadas
    console.log("Rutas recargadas después de borrarse.");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <LogoHeader />
        <UserSetup onUserSet={handleSetCurrentUser} />
        <RouteForm onAddRoute={handleAddRoute} />
        <RouteTabs
          routes={routes}
          onDelete={handleDeleteRoute}
          onJoin={handleJoinRoute}
          onLeave={handleLeaveRoute}
        />
        <Footer />
      </div>
    </div>
  );
};

export default App;