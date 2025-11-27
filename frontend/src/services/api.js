import axios from 'axios';

const API_BASE = '/api';

export const fetchPredictions = async () => {
  try {
    const response = await axios.get(`${API_BASE}/predictions/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching predictions:', error);
    return [];
  }
};

export const fetchWeatherData = async () => {
  try {
    const response = await axios.get(`${API_BASE}/weather/current`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    return [];
  }
};

export const fetchHighRiskZones = async () => {
  try {
    const response = await axios.get(`${API_BASE}/predictions/high-risk-zones`);
    return response.data;
  } catch (error) {
    console.error('Error fetching high-risk zones:', error);
    return [];
  }
};

export const generatePredictions = async () => {
  try {
    const response = await axios.post(`${API_BASE}/predictions/generate`);
    return response.data;
  } catch (error) {
    console.error('Error generating predictions:', error);
    return [];
  }
};
