
import axios from 'axios';
import genreSeedMap from './genreSeeds';

export const fetchRecommendation = async (genre, valence, energy) => {
  const seedId = genreSeedMap[genre];

  const params = {
    seeds: seedId,
    size: 1,
    valence,
    energy,
  };

  const response = await axios.get('https://api.reccobeats.com/v1/track/recommendation', { params });
  return response.data;
};

