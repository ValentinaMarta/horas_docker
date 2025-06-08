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

export const createUsuario = async (nuevoUsuario) => {
  try {
    const response = await axios.post(`${API_URL}/usuarios`, nuevoUsuario, authHeader());
    return response.data;
  } catch (error) {
    console.error("Error creando usuario:", error.response?.data || error.message);
    throw error;
  }
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
