import styles from "./MoodEnergyChart.module.css";
import React, { useRef, useState, useEffect } from "react";
import MoodEnergyChartWrapper from './MoodEnergyChartWrapper.js';

const convertCoordsToMood = (x, y) => {
  const valence = (x + 5) / 10;
  const energy  = (y + 5) / 10;
  return { valence, energy };
};

export default function MoodEnergyChart({ updateMood, mood }) {
  const [backgroundColorClass, setBackgroundColorClass] = useState(null);
  
  useEffect(() => {
    const valence = mood.valence;
    const energy = mood.energy;

    if (valence === 0.5 && energy === 0.5) {
      setBackgroundColorClass(styles.backgroundWhite)
    } else if (valence < 0.5 && energy < 0.5) {
      setBackgroundColorClass(styles.backgroundBlue)
    } else if (valence < 0.5) {
      setBackgroundColorClass(styles.backgroundRed)
    } else if (energy < 0.5) {
      setBackgroundColorClass(styles.backgroundGreen)
    } else {
      setBackgroundColorClass(styles.backgroundYellow)
    }}, [mood]
  )

  const chartRef = useRef(null);


  const getCoordsFromEvent = (e) => {
    const chart = chartRef.current;
    if (!chart) return null;

    const { left, top, width, height } = chart.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;
    const xVal = (mouseX / width)  * 10 - 5;
    const yVal = 5 - (mouseY / height) * 10;

    if (xVal >= -5 && xVal <= 5 && yVal >= -5 && yVal <= 5) {
      return { xVal, yVal };
    }
    return null;
  };

  const handleClick = (e) => {
    const coords = getCoordsFromEvent(e);
    if (!coords) return;
    const { xVal, yVal } = coords;
    console.log("User selected coords: (" + xVal + ", " + yVal + ")");

    const { valence, energy } = convertCoordsToMood(xVal, yVal);
    console.log("New mood values: Valence ", valence, " Energy: ", energy);

    updateMood({ valence, energy });
  };

  const handleMouseMove = (e) => {
    // kept in case you want hover behavior later
  };

  return (
    <MoodEnergyChartWrapper>
      <div
        ref={chartRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        className={`${styles["chart-background"]} ${backgroundColorClass || ''}`}        
        style={{ width: "100%", height: "100%", position: "relative", cursor: "pointer", borderRadius: 0 }}
      >
  
        {/* Current mood dot */}
        {mood.valence != null && mood.energy != null && (
          <div style={{
            position: "absolute",
            left: `${mood.valence * 100}%`,
            top: `${(1 - mood.energy) * 100}%`,
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            background: "black",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }} />
        )}

        {/* Labels */}
        <div style={{ position: "absolute", top: "-30px", left: "50%", transform: "translateX(-50%)", fontWeight: "bold" }}>
          Energetic
        </div>
        <div style={{ position: "absolute", bottom: "-30px", left: "50%", transform: "translateX(-50%)", fontWeight: "bold" }}>
          Calm
        </div>
        <div style={{ position: "absolute", top: "50%", left: "-43px", transform: "translateY(-50%)", fontWeight: "bold" }}>
          Sad
        </div>
        <div style={{ position: "absolute", top: "50%", right: "-63px", transform: "translateY(-50%)", fontWeight: "bold" }}>
          Happy
        </div>
      </div>
    </MoodEnergyChartWrapper>
  );
}