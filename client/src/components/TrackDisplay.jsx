// // client/src/components/TrackDisplay.jsx
// import React from 'react';
// import styles from './TrackDisplay.module.css';
// import { GenerateEmbedURL } from '../fetch/get-url';

// export default function TrackDisplay({ playlist }) {
//   const embedUrl = `https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator&t=${playlist.lastModified}`;
//   console.log("Spotify embed URL: " + embedUrl);
//   console.log("New spotify embed playlist name: " + playlist.name);

//   return (
//     <iframe
//         key={`${playlist.id}-${playlist.lastModified}`}
//         title={playlist.name}
//         src={embedUrl}
//         frameBorder="0"
//         allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
//         allowFullScreen
//         className={styles['responsive-iframe']}
//       />
//   );
// }

import React, { useState, useEffect } from 'react';
import styles from './TrackDisplay.module.css';

export default function TrackDisplay({ playlist}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {

    console.log("\n\n\n\n\n\n-------------------------------")
    console.log("USEEFFECT FUNCTION IN TRACKDISPLAY IS RUNNING")
    console.log("-------------------------------\n\n\n\n\n\n")



    // async function run() {
    //   setReady(false);
    //   const tokenRes = await fetch('/api/spotify/token');
    //   const tokenData = await tokenRes.json();
    //   const accessToken = tokenData.token;

    //   const interval = setInterval(async () => {
    //     const playlistRes = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}`, {
    //       headers: { Authorization: `Bearer ${accessToken}` }
    //     });
    //     const playlistData = await playlistRes.json();
    //     const trackIds = playlistData.tracks.items.map(item => item.track.id);
    //     const expectedIds = playlist.songs.map(t => t.id);
    //     const tracksMatch = expectedIds.every(id => trackIds.includes(id));

    //     if (tracksMatch) {
    //       setReady(true);
    //       clearInterval(interval);
    //     }
    //   }, 1000);

    //   return () => clearInterval(interval);
    // }
    // run();
  }, [playlist.lastModified]);

  const embedUrl = `https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator&t=${playlist.lastModified}`;

  if (!ready) return <div>Updating playlist...</div>;

  return (
    <iframe
      key={`${playlist.id}-${playlist.lastModified}`}
      title={playlist.name}
      src={embedUrl}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      allowFullScreen
      className={styles['responsive-iframe']}
    />
  );
}