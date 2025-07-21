import React, { useState } from 'react';
import TrackDisplay    from '../components/TrackDisplay';
import MoodEnergyChart from '../components/MoodEnergyChart/MoodEnergyChart';
import { GetRecommendations } from '../fetch/get-recs';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';

export default function ExplorePage({ mood, setMood, genre, setGenre }) {
    const navigate = useNavigate();

    //test
    useEffect(() => {
        console.log(mood)
    }, [mood])

    useEffect(() => {
        const handleKeyDown = (event) => {
        switch (event.key) {
            case 'ArrowLeft': {
                console.log('Left arrow pressed');

                setMood(prev => {
                    let newValence = Math.max(0, prev.valence - 0.1)
                    newValence = Math.round(newValence * 10) / 10;

                    return {
                        ...prev,
                        valence: newValence
                    }
                });
                break;
            }
            case 'ArrowRight': {
                console.log('Right arrow pressed');

                setMood(prev => {
                    let newValence = Math.min(1, prev.valence + 0.1)
                    newValence = Math.round(newValence * 10) / 10;

                    return {
                        ...prev,
                        valence: newValence
                    }
                });
                break;

                // let valence = mood.valence;
                // valence += 0.1;
                
                // if (valence > 1) {
                //     valence = 1;
                // }

                // valence = Math.round(valence * 10) / 10;

                // setMood({valence: valence, energy: mood.energy});
                // break;
            }
            case 'ArrowUp': {
                console.log('Up arrow pressed');

                setMood(prev => {
                    let newEnergy = Math.min(1, prev.energy + 0.1)
                    newEnergy = Math.round(newEnergy * 10) / 10;

                    return {
                        ...prev,
                        energy: newEnergy
                    }
                });
                break;
            }
            case 'ArrowDown': {
                console.log('Down arrow pressed');

                setMood(prev => {
                    let newEnergy = Math.max(0, prev.energy - 0.1)
                    newEnergy = Math.round(newEnergy * 10) / 10;

                    return {
                        ...prev,
                        energy: newEnergy
                    }
                });
                break;

                // let energy = mood.energy;
                // energy -= 0.1;
                
                // if (energy < 0) {
                //     energy = 0;
                // }

                // setMood({valence: mood.valence, energy: energy});
                // break;
            }
            default:
                return; //ignore other keys
        }
        };


        window.addEventListener('keydown', handleKeyDown);


        return () => {
        window.removeEventListener('keydown', handleKeyDown);
        };
    }, [mood]); //empty array: run once on mount, cleanup on unmount


    return (
        <div>
            <h1>Explore Page</h1>
            <button onClick={() => navigate("/")}>Go to Landing Page</button>
        </div>
    );
}