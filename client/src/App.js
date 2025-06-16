import React from 'react';
import TrackDisplay from './components/TrackDisplay';
import './App.css';

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <h1 className="brand">SoundTrail</h1>
      </nav>
      <main>
        {/* Mock query for Sprint 1 */}
        <TrackDisplay query="dreamy acoustic" />
      </main>
    </div>
  );
}

export default App;
