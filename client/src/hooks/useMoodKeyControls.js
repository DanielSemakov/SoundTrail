import { useEffect } from 'react';


export default function useMoodKeyControls(mood, setMood) {
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
            }
            default:
                return; //ignore other keys
        }
        };


        window.addEventListener('keydown', handleKeyDown);


        return () => {
        window.removeEventListener('keydown', handleKeyDown);
        };
    }, [mood, setMood]);
}