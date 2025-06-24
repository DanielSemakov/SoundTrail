import React from 'react';

const GenreSelector = ({ selectedGenre, onGenreChange }) => {
  const genres = ['rock', 'jazz', 'pop', 'classical', 'electronic', 'hip-hop'];

  return (
    <select value={selectedGenre} onChange={(e) => onGenreChange(e.target.value)}>
      {genres.map(genre => (
        <option key={genre} value={genre}>{genre.charAt(0).toUpperCase() + genre.slice(1)}</option>
      ))}
    </select>
  );
};

export default GenreSelector;