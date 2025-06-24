// import React, { useEffect, useRef } from 'react';
// import './TrackDisplay.css';

// const TrackDisplay = ({ track }) => {
//   const audioRef = useRef(null);

//   // This effect runs whenever the 'track' prop changes.
//   useEffect(() => {
//     // When the track changes, pause the current one (if it exists)
//     // and load and play the new one.
//     if (audioRef.current) {
//       audioRef.current.pause();
//       audioRef.current.load();
//       audioRef.current.play().catch(error => {
//         // Autoplay can sometimes be blocked by the browser.
//         // The 'controls' attribute will allow the user to manually play.
//         console.log("Autoplay was prevented: ", error);
//       });
//     }
//   }, [track]);


//   if (!track) {
//     return null;
//   }

//   const { name, artists, album, preview_url } = track;
//   const artistName = artists.map(artist => artist.name).join(', ');
//   const albumArt = album.images.length > 0 ? album.images[0].url : 'default-album-art.png';

//   return (
//     <div className="track-display">
//       <img src={albumArt} alt={`Album art for ${album.name}`} className="album-art" />
//       <div className="track-info">
//         <h2>{name}</h2>
//         <p>{artistName}</p>
//         <p><em>{album.name}</em></p>
//         {preview_url && (
//           <audio
//             ref={audioRef}
//             controls
//             src={preview_url}
//             className="audio-player"
//           >
//             Your browser does not support the audio element.
//           </audio>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TrackDisplay;


// client/src/components/TrackDisplay.js
import React from 'react';
import './TrackDisplay.css';

const TrackDisplay = ({ track }) => {
  if (!track) return null;

  const artistNames = track.artists.map((artist) => artist.name).join(', ');
  const albumArt = track.album?.images?.[0]?.url;
  const previewUrl = track.preview_url;

  return (
    <div className="track-display">
      <h2>🎶 Now Playing</h2>
      <h3>{track.name}</h3>
      <p><strong>Artist:</strong> {artistNames}</p>
      {albumArt ? (
        <img
          src={albumArt}
          alt="Album Art"
          style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '12px' }}
        />
      ) : (
        <p>No album art available.</p>
      )}
      {previewUrl ? (
        <div>
          <p><strong>Preview:</strong></p>
          <audio controls src={previewUrl} style={{ width: '100%' }} />
        </div>
      ) : (
        <p>No preview available.</p>
      )}
    </div>
  );
};

export default TrackDisplay;

