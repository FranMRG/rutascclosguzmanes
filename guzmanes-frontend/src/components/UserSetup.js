// src/components/UserSetup.js
import React, { useState, useEffect } from 'react';
import { setCurrentUser, getCurrentUser } from '../utils/storage';

const UserSetup = ({ onUserSet }) => {
  const [username, setUsername] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUsername(user);
      onUserSet(user);
    } else {
      setIsEditing(true);
    }
  }, [onUserSet]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setCurrentUser(username);
      onUserSet(username);
      setIsEditing(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-700">
          Estás registrado como: <span className="font-medium">{username}</span>
          <button
            onClick={() => setIsEditing(true)}
            className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
          >
            Cambiar
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Tu nombre de ciclista"
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
        >
          Guardar
        </button>
      </form>
    </div>
  );
};

export default UserSetup;