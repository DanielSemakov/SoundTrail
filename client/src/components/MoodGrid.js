import React, { useState } from 'react'; // Corrected import
import './MoodGrid.css';

const MoodGrid = ({ onMoodChange }) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const handleGridClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const valence = x / rect.width;
    const energy = 1 - (y / rect.height); // Invert y-axis for energy

    setPosition({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
    onMoodChange({ valence, energy });
  };

  return (
    <div className="mood-grid-container">
      <div className="mood-grid" onClick={handleGridClick}>
        <div className="mood-point" style={{ left: `${position.x}%`, top: `${position.y}%` }}></div>
        <div className="axis-label x-axis">Valence (Mood)</div>
        <div className="axis-label y-axis">Energy</div>
      </div>
    </div>
  );
};

export default MoodGrid;