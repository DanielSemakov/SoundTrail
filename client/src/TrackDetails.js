import React, { useEffect, useState } from 'react';

function TrackDetails() {
  const [track, setTrack] = useState(null);

  useEffect(() => {
    fetch("https://api.reccobeats.com/v1/track?ids=83dc71c7-b9da-466b-a198-bb3c29ee8f00", {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        setTrack(data.data[0]); // assuming data.data is an array
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Track Details</h2>
      {track ? (
        <div>
          <p><strong>Name:</strong> {track.name}</p>
          <p><strong>Artist:</strong> {track.artist}</p>
          <p><strong>Album:</strong> {track.album}</p>
          <p><strong>Valence:</strong> {track.valence}</p>
          <p><strong>Energy:</strong> {track.energy}</p>
        </div>
      ) : (
        <p>Loading track info...</p>
      )}
    </div>
  );
}

export default TrackDetails;
