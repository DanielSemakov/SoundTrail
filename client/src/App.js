import React from 'react';
import MoodEnergyChart from './components/MoodEnergyChart';

const sampleData = [
  { mood: 8, energy: 7 },
  { mood: 5, energy: 6 },
  { mood: 3, energy: 4 },
  { mood: 9, energy: 8 },
];

function App() {
  return (
    <div>
      <h1>Mood vs Energy Chart</h1>
      <MoodEnergyChart />
    </div>
  );
}

export default App;