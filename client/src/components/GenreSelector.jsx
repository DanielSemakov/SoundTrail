

import React from 'react';

export default function GenreSelector({ genre, setGenre }) {
  return (
    <div className="genre-container">
      <label htmlFor="genre">Genre</label>
      <select 
        id="genre" 
        value={genre} 
        onChange={e => setGenre(e.target.value)}
      >
        <option value="all">All</option>
        <option value="edm">EDM</option>
        <option value="latin">Latin</option>
        <option value="pop">Pop</option>
        <option value="rap">Rap</option>
        <option value="rock">Rock</option>
      </select>
    </div>
  );
}
