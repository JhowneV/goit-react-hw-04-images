import axios from 'axios';

export const getAPI = async (query, page) => {
const API_KEY = '43144541-7bc3dc74e4831635c05dca2cc';
  const BASE_URL = 'https://pixabay.com/api/';
  const response = await fetch(
    `${BASE_URL}?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch images');
  }
  return response.json();

};
