import { apiClient } from '../axios';

const API_URL = '/api/games';

const getAllGames = async (params) => {
    const response = await apiClient.get(API_URL, { params });
    return response.data;
};

const getGameById = async (id) => {
    const response = await apiClient.get(`${API_URL}/${id}`);
    return response.data;
};

const createGame = async (gameData) => {
    const response = await apiClient.post(API_URL, gameData);
    return response.data;
};

const updateGame = async (id, gameData) => {
    const response = await apiClient.put(`${API_URL}/${id}`, gameData);
    return response.data;
};

const deleteGame = async (id) => {
    const response = await apiClient.delete(`${API_URL}/${id}`);
    return response.data;
};

const getStats = async () => {
    const response = await apiClient.get(`${API_URL}/stats`);
    return response.data;
};

const gameService = {
    getAllGames,
    getGameById,
    createGame,
    updateGame,
    deleteGame,
    getStats
};

export default gameService;
