// guzmanes-frontend/src/utils/api.js
const BASE_URL = 'https://guzmanes-backend.onrender.com'; // ¡ASEGÚRATE DE QUE ESTA ES LA URL DE TU BACKEND!

export const syncRoutes = async (routes) => {
  // Esta función parece que no se usa directamente para añadir,
  // sino para una posible sincronización masiva si la implementaras.
  // Por ahora, se mantiene para la estructura.
  try {
    const response = await fetch(`${BASE_URL}/routes`, {
      method: 'POST', // O PUT, dependiendo de cómo la uses para una "sincronización"
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ routes }), // Esto no es lo que espera tu endpoint POST /routes
    });
    // Si tu POST /routes espera un solo objeto de ruta, esto sería incorrecto.
    // Asumimos que esta función está pensada para otra cosa o es un vestigio.
    // La dejaremos tal cual, pero tenlo en cuenta.
    return await response.json();
  } catch (error) {
    console.error('Sync routes error:', error);
    return { routes: [] };
  }
};

export const getRemoteRoutes = async () => {
  try {
    const response = await fetch(`${BASE_URL}/routes`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Rutas obtenidas del backend:", data); // ¡Añadido para depuración!
    return data || []; // Tu backend devuelve directamente la lista de rutas
  } catch (error) {
    console.error('Fetch remote routes error:', error);
    return [];
  }
};

export const addRemoteRoute = async (newRoute) => {
  try {
    const response = await fetch(`${BASE_URL}/routes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRoute),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Ruta añadida remotamente:", data); // ¡Añadido para depuración!
    return data; // Devuelve la ruta creada con su ID
  } catch (error) {
    console.error('Add remote route error:', error);
    return null;
  }
};

export const deleteRemoteRoute = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/routes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log(`Ruta ${id} borrada remotamente.`); // ¡Añadido para depuración!
    return true; // Devuelve true si la eliminación fue exitosa
  } catch (error) {
    console.error('Delete remote route error:', error);
    return false;
  }
};


export const syncUser = async (username) => {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Usuario sincronizado remotamente:", data); // ¡Añadido para depuración!
    return data;
  } catch (error) {
    console.error('User sync error:', error);
    return null;
  }
};

export const joinRemoteRoute = async (routeId, participantObj) => {
  try {
    const response = await fetch(`${BASE_URL}/routes/${routeId}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(participantObj), // El backend espera un objeto { username: "..." }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(`Usuario ${participantObj.username} unido a ruta ${routeId} remotamente:`, data); // ¡Añadido para depuración!
    return data; // El backend devuelve la ruta actualizada
  } catch (error) {
    console.error('Join remote route error:', error);
    return null;
  }
};

export const leaveRemoteRoute = async (routeId, participantObj) => {
  try {
    const response = await fetch(`${BASE_URL}/routes/${routeId}/leave`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(participantObj), // El backend espera un objeto { username: "..." }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(`Usuario ${participantObj.username} borrado de ruta ${routeId} remotamente:`, data); // ¡Añadido para depuración!
    return data; // El backend devuelve la ruta actualizada
  } catch (error) {
    console.error('Leave remote route error:', error);
    return null;
  }
};