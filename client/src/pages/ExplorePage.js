import React, { useState } from 'react';
import TrackDisplay    from '../components/TrackDisplay';
import MoodEnergyChart from '../components/MoodEnergyChart/MoodEnergyChart';
import { GetRecommendations } from '../fetch/get-recs';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';

export default function ExplorePage() {
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (event) => {
        switch (event.key) {
            case 'ArrowLeft':
                console.log('Left arrow pressed');
                break;
            case 'ArrowRight':
                console.log('Right arrow pressed');
                break;
            case 'ArrowUp':
                console.log('Up arrow pressed');
                break;
            case 'ArrowDown':
                console.log('Down arrow pressed');
                break;
            default:
                return; //ignore other keys
        }
        };


        window.addEventListener('keydown', handleKeyDown);


        return () => {
        window.removeEventListener('keydown', handleKeyDown);
        };
    }, []); //empty array: run once on mount, cleanup on unmount


    return (
        <div>
            <h1>Explore Page</h1>
            <button onClick={() => navigate("/")}>Go to Landing Page</button>
        </div>
    );
}