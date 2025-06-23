import React, {useState} from 'react';
import MoodEnergyChart from './components/MoodEnergyChart/MoodEnergyChart';

function App() {
  const [valence, setValence] = useState(null);
  const [energy, setEnergy] = useState(null);

  const updateMood = ({valence, energy}) => {
    setValence(valence);
    setEnergy(energy);
  };

  return (
    <div>
      <h1>Mood vs Energy Chart</h1>
      <MoodEnergyChart
        valence={valence}
        energy={energy}
        updateMood={updateMood}
      />
      {/* <GenreSelection 
        onSelect={({ genre }) => {
          setGenre(genre);
        }}
      />
      <SubmitButton 
        valence={valence}
        energy={energy}
        genre={genre}
      /> */}
    </div>
  );
}

export default App;