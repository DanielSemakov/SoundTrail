import React, { useState } from 'react';
import TrackDisplay    from '../components/TrackDisplay';
import MoodEnergyChart from '../components/MoodEnergyChart/MoodEnergyChart';
import { GetRecommendations } from '../fetch/get-recs';
import { useNavigate } from "react-router-dom";

export default function ExplorePage() {
    const navigate = useNavigate();

    const [trail, setTrail] = useState([]);
    
    const [mood,  setMood] = useState({valence: 0.5, energy: 0.5});

    //The function below has been moved to MoodEnergyChart.js
    //function addPoint(x, y){
      //Is the "..." needed here?
      //setTrail(prev => [...prev, {x, y}]);
    //}
    
    //Update history button is a placeholder. Actual "button" will be when/where the newest dot is selected
    //I can't test my code until I find a way to link it to the actual graph
    //We need to eventually move the graph from LandingPage to here
    return (
        <div>
            <h1>Explore Page</h1>
            <button onClick = {() => navigate("/")}>Go to Landing Page</button>
            <button type = "button" onClick = {addPoint(getSelectedXCoord(), getSelectedYCoord())}>Update History</button>
        </div>
    );
}