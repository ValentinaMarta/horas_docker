// src/api.js
import axios from "axios";

const API_URL = ""; // usa '' si usas proxy


const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

/* ───────────────────────────────────────
   USUARIOS
─────────────────────────────────────── */
export const getUsuarios = async () => {
  try {
    const response = await axios.get(`${API_URL}/usuarios`, authHeader());
    return response.data;
  } catch (error) {
    console.error("Error obteniendo usuarios:", error.response?.data || error.message);
    return [];
  }
};

export const deleteUsuario = async (id) => {
  try {
    await axios.delete(`${API_URL}/usuarios/${id}`, authHeader());
  } catch (error) {
    console.error(`Error eliminando usuario ${id}:`, error.response?.data || error.message);
  }
};



export const createUsuario = async (usuario) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/usuarios/registrar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(usuario)
  });

  if (!res.ok) throw new Error('Error al crear usuario');
  return await res.json();
};


export const updateUsuario = async (id, datosActualizados) => {
  try {
    const response = await axios.put(`${API_URL}/usuarios/${id}`, datosActualizados, authHeader());
    return response.data;
  } catch (error) {
    console.error("Error actualizando usuario:", error.response?.data || error.message);
    throw error;
  }
};

/* ───────────────────────────────────────
   VACACIONES
─────────────────────────────────────── */
export const getVacaciones = async (usuarioId) => {
  try {
    const response = await axios.get(`${API_URL}/vacaciones/usuario/${usuarioId}`, authHeader());
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo vacaciones del usuario ${usuarioId}:`, error.response?.data || error.message);
    return [];
  }
};
// GUARDAR VACACIONES
export const saveVacaciones = async (userId, body) => {
  return fetch(`/vacaciones/usuario/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
};

/* ───────────────────────────────────────
   FICHAJES
─────────────────────────────────────── */
export const getFichajes = async (usuarioId) => {
  try {
    const response = await axios.get(`${API_URL}/fichajes/usuario/${usuarioId}`, authHeader());
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo fichajes del usuario ${usuarioId}:`, error.response?.data || error.message);
    return [];
  }
};
// GUARDAR FICHAJES
export const saveFichajes = async (userId, body) => {
  return fetch(`/fichajes/usuario/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
};
