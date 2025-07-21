import React, { createContext, useState, useContext } from 'react';

const TrackContext = createContext();

export function TrackProvider({ children }) {
  const [track, setTrack] = useState(null);
  return (
    <TrackContext.Provider value={{ track, setTrack }}>
      {children}
    </TrackContext.Provider>
  );
}

export function useTrack() {
  return useContext(TrackContext);
}
