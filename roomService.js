import api from './api';

export const getRooms = async (params = {}) => {
  const response = await api.get('/rooms', { params });
  return response.data;
};

export const getRoomById = async (id) => {
  const response = await api.get(`/rooms/${id}`);
  return response.data;
};

export const checkRoomAvailability = async (id, checkIn, checkOut) => {
  const response = await api.get(`/rooms/${id}/availability`, {
    params: { checkIn, checkOut },
  });
  return response.data;
};

export const createRoom = async (roomData) => {
  const response = await api.post('/rooms', roomData);
  return response.data;
};

export const updateRoom = async (id, roomData) => {
  const response = await api.put(`/rooms/${id}`, roomData);
  return response.data;
};

export const deleteRoom = async (id) => {
  const response = await api.delete(`/rooms/${id}`);
  return response.data;
};
