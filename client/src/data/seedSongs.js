import songsData from './songs.json';

/**
 * Returns an array of Spotify track IDs for the given genre.
 * @param {string} genre - The genre string (e.g., 'rock', 'pop').
 * @returns {string[]} An array of Spotify track IDs. Returns empty array if no songs found for genre.
 */
export function getSeedSongsByGenre(genre) {
  // Filter songs by the selected genre and return their IDs
  // Ensure case-insensitivity by converting both to lower case
  const seedSongs = songsData.filter(song => song.genre && song.genre.toLowerCase() === genre.toLowerCase());
  return seedSongs.map(song => song.id);
}

