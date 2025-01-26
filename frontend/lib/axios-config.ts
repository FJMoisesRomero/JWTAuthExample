import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5241/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para respuestas
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, la devolvemos tal cual
    return response;
  },
  (error) => {
    // Si hay un error, lo transformamos para que sea más fácil de manejar
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      return Promise.reject({
        ...error,
        message: error.response.data.message || 'Error en la solicitud',
      });
    } else if (error.request) {
      // La solicitud se hizo pero no se recibió respuesta
      return Promise.reject({
        ...error,
        message: 'No se pudo conectar con el servidor',
      });
    } else {
      // Algo sucedió al configurar la solicitud
      return Promise.reject({
        ...error,
        message: 'Error al realizar la solicitud',
      });
    }
  }
);

export default api;
