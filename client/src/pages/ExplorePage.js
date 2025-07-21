import React, { useState } from 'react';
import TrackDisplay    from '../components/TrackDisplay';
import MoodEnergyChart from '../components/MoodEnergyChart/MoodEnergyChart';
import { GetRecommendations } from '../fetch/get-recs';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import useMoodKeyControls from "../hooks/useMoodKeyControls";

export default function ExplorePage({ mood, setMood, genre, setGenre }) {
    const navigate = useNavigate();
    useMoodKeyControls(mood, setMood);

    //test
    useEffect(() => {
        console.log(mood)
    }, [mood])



    return (
        <div>
            <h1>Explore Page</h1>
            <button onClick={() => navigate("/")}>Go to Landing Page</button>
        </div>
    );
}