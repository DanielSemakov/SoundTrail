

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
        <option value="83dc71c7-b9da-466b-a198-bb3c29ee8f00">All</option>
        <option value="rock">Rock</option>
        <option value="pop">Pop</option>
        <option value="hiphop">Hip-Hop</option>
        <option value="jazz">Jazz</option>
      </select>
    </div>
  );
}
