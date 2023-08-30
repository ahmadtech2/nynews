// services/api.js
import axios from 'axios';

const API_KEY = 'J48MtQBfu3vGaNlxLQUoreotZnEk8bHb'; // Replace with your actual API key

const api = axios.create({
  baseURL: 'https://api.nytimes.com/svc/mostpopular/v2/',
  params: {
    'api-key': API_KEY,
  },
});

export const fetchMostEmailedArticles = async (days = 7) => {
  try {
    const response = await api.get(`/mostviewed/all-sections/${days}.json`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
