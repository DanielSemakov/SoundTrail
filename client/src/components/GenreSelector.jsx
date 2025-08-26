

import React from 'react';

export default function GenreSelector({ genre, setGenre, className }) {
  return (
    <div>
      {/* <label htmlFor="genre">Genre</label> */}
      <select 
        id="genre" 
        value={genre} 
        onChange={e => setGenre(e.target.value)}
        style={{
          // display: "block",
          // alignItems: 'stretch' 
          // width: '90%',
          // display: 'block',
          // boxSizing: 'border-box'   

          height: '2.2em',
          // lineHeight: '1.2',
          width: '90%',
          display: 'block',
          margin: '0 auto',
          boxSizing: 'border-box',
          fontSize: '0.875rem',
          border: '1px solid black',
          backgroundColor: 'lightgray'
        }}
      >
        <option style={{width: '90%'}} value="all">All</option>
        <option value="edm">EDM</option>
        <option value="latin">Latin</option>
        <option value="pop">Pop</option>
        <option value="r&b">R&B</option>
        <option value="rap">Rap</option>
        <option value="rock">Rock</option>
      </select>
    </div>
  );
}
