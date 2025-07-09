import React, { useState } from 'react';
import TrackDisplay    from '../components/TrackDisplay';
import MoodEnergyChart from '../components/MoodEnergyChart/MoodEnergyChart';
import { GetRecommendations } from '../fetch/get-recs';
import { useNavigate } from "react-router-dom";


export default function ExplorePage() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Explore Page</h1>
            <button onClick={() => navigate("/")}>Go to Landing Page</button>
        </div>
    );
}