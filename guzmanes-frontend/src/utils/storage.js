// guzmanes-frontend/src/utils/storage.js
import {
  getRemoteRoutes as apiGetRemoteRoutes,
  addRemoteRoute as apiAddRemoteRoute, // Importar la nueva función
  deleteRemoteRoute as apiDeleteRemoteRoute,
  syncUser as apiSyncUser,
  joinRemoteRoute as apiJoinRemoteRoute,
  leaveRemoteRoute as apiLeaveRemoteRoute
} from './api';

// Función para obtener las rutas del backend (y guardarlas localmente si lo deseas)
export const getRoutes = async () => {
  try {
    const routes = await apiGetRemoteRoutes(); // Siempre obtener del backend
    localStorage.setItem('cycling_routes', JSON.stringify(routes)); // Opcional: mantener una copia local
    return routes;
  } catch (error) {
    console.error('Error getting routes from API:', error);
    // Si la API falla, intenta cargar del localStorage como fallback
    const localRoutes = localStorage.getItem('cycling_routes');
    return localRoutes ? JSON.parse(localRoutes) : [];
  }
};

// addRoute ahora llama a la API y luego recarga todas las rutas del backend
export const addRoute = async (newRoute) => {
  try {
    await apiAddRemoteRoute(newRoute); // Añade la ruta a través de la API
    const updatedRoutes = await getRoutes(); // Recarga todas las rutas del backend
    return updatedRoutes;
  } catch (error) {
    console.error('Error adding route:', error);
    return await getRoutes(); // Intenta recargar por si hay datos parciales o error en la adición
  }
};

// deleteRoute ahora llama a la API y luego recarga todas las rutas del backend
export const deleteRoute = async (id) => {
  try {
    const success = await apiDeleteRemoteRoute(id); // Borra la ruta a través de la API
    if (success) {
      const updatedRoutes = await getRoutes(); // Recarga todas las rutas del backend
      return updatedRoutes;
    }
    return await getRoutes(); // Si falla, intenta recargar
  } catch (error) {
    console.error('Error deleting route:', error);
    return await getRoutes();
  }
};

// joinRoute ahora llama a la API y luego recarga todas las rutas del backend
export const joinRoute = async (routeId, participantObj) => {
  try {
    await apiJoinRemoteRoute(routeId, participantObj); // Une al participante a través de la API
    const updatedRoutes = await getRoutes(); // Recarga todas las rutas del backend
    return updatedRoutes;
  } catch (error) {
    console.error('Error joining route:', error);
    return await getRoutes();
  }
};

// leaveRoute ahora llama a la API y luego recarga todas las rutas del backend
export const leaveRoute = async (routeId, participantObj) => {
  try {
    await apiLeaveRemoteRoute(routeId, participantObj); // Borra al participante a través de la API
    const updatedRoutes = await getRoutes(); // Recarga todas las rutas del backend
    return updatedRoutes;
  } catch (error) {
    console.error('Error leaving route:', error);
    return await getRoutes();
  }
};

export const getCurrentUser = () => {
  return localStorage.getItem('cycling_user') || '';
};

export const setCurrentUser = async (username) => {
  localStorage.setItem('cycling_user', username);
  console.log("Syncing user with backend:", username);
  await apiSyncUser(username); // Sincronizar el usuario con el backend
};