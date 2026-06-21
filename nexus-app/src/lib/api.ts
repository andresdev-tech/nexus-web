import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Adjuntar JWT automáticamente
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('nexus_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Redirigir al login si el token expira
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('nexus_token');
      localStorage.removeItem('nexus_usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ─────────────────────────────────────────────────────
export const authAPI = {
  registrar:            (data: any) => api.post('/auth/registro', data),
  login:                (data: any) => api.post('/auth/login', data),
  logout:               ()          => api.post('/auth/logout'),
  recuperarPassword:    (data: any) => api.post('/auth/recuperar-password', data),
  restablecerPassword:  (data: any) => api.post('/auth/restablecer-password', data),
  verificarCodigo:      (data: any) => api.post('/auth/verificar-codigo', data),
};

// ── Usuarios ──────────────────────────────────────────────────
export const usuariosAPI = {
  obtenerPerfil:    ()        => api.get('/usuarios/perfil'),
  actualizarPerfil: (data: any) => api.put('/usuarios/perfil', data),
  listarUsuarios:   ()        => api.get('/usuarios'),
  eliminarUsuario:  (id: number) => api.delete(`/usuarios/${id}`),
  cambiarRol:       (id: number, rol_id: number) => api.put(`/usuarios/${id}/rol`, { rol_id }),
};

// ── Programas ──────────────────────────────────────────────────
export const programasAPI = {
  listar:     ()           => api.get('/programas'),
  obtener:    (id: number) => api.get(`/programas/${id}`),
  crear:      (data: any)  => api.post('/programas', data),
  actualizar: (id: number, data: any) => api.put(`/programas/${id}`, data),
  eliminar:   (id: number) => api.delete(`/programas/${id}`),
};

// ── Inscripciones ─────────────────────────────────────────────
export const inscripcionesAPI = {
  misInscripciones: ()           => api.get('/inscripciones/mis-inscripciones'),
  inscribirse:      (programa_id: number) => api.post('/inscripciones', { programa_id }),
  cancelar:         (id: number) => api.delete(`/inscripciones/${id}`),
  listarTodas:      ()           => api.get('/inscripciones'),
};

// ── Chatbot ───────────────────────────────────────────────────
export const chatbotAPI = {
  consultar:       (mensaje: string) => api.post('/chatbot/consulta', { mensaje }),
  obtenerHistorial: ()               => api.get('/chatbot/historial'),
};

// ── Coordinador ───────────────────────────────────────────────
export const coordinadorAPI = {
  misProgramas:        ()                          => api.get('/coordinador/programas'),
  obtenerGrupo:        (programaId: number)         => api.get(`/coordinador/programas/${programaId}/grupo`),
  actualizarFaltas:    (inscripcionId: number, total_faltas: number) => api.put(`/coordinador/inscripcion/${inscripcionId}/faltas`, { total_faltas }),
  actualizarLimite:    (inscripcionId: number, limite_faltas: number) => api.put(`/coordinador/inscripcion/${inscripcionId}/limite-faltas`, { limite_faltas }),
  levantarSuspension:  (inscripcionId: number)      => api.post(`/coordinador/inscripcion/${inscripcionId}/levantar-suspension`),
  expulsar:            (inscripcionId: number, motivo: string) => api.delete(`/coordinador/inscripcion/${inscripcionId}/expulsar`, { data: { motivo } }),
};

export default api;