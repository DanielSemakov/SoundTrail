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

  return (
    <MoodEnergyChartWrapper>
      <div
        ref={chartRef}
        onClick={handleClick}
        className={`${styles["chart-background"]} ${backgroundColorClass || ''}`}
      >
        {mood.valence != null && mood.energy != null && (
          <div className={styles.dot} style={{
            left: `${mood.valence * 100}%`,
            top: `${(1 - mood.energy) * 100}%`,
          }} />
        )}
        <div className={styles["label-top"]}>Energetic</div>
        <div className={styles["label-bottom"]}>Calm</div>
        <div className={styles["label-left"]}>Sad</div>
        <div className={styles["label-right"]}>Happy</div>
      </div>
    </MoodEnergyChartWrapper>
  );
}