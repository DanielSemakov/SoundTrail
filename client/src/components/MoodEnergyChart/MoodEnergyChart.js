import styles from "./MoodEnergyChart.module.css";
import React, { useRef, useState } from "react";
import MoodEnergyChartWrapper from './MoodEnergyChartWrapper.js';

import {
  ScatterChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
  Line
} from "recharts";

const convertCoordsToMood = (x, y) => {
  const valence = (x + 5) / 10;
  const energy  = (y + 5) / 10;
  return { valence, energy };
};

// Recharts' internal plot area offsets (with all margins set to 0,
// it still reserves ~5px left and ~5px top for axis/tick space).
// Tune these if the dot still feels off.
const CHART_OFFSET_LEFT = 0;
const CHART_OFFSET_TOP  = 0;

export default function MoodEnergyChart({ updateMood, mood, trailEnabled }) {
  console.log("MoodEnergyChart mood prop (at top of function):", mood);


  const chartRef = useRef(null);
  const [trail, setTrail] = useState([]);
  const [hoverPoint, setHoverPoint] = useState(null);

  const getSelectedXCoord = () => mood.valence * 10 - 5;
  const getSelectedYCoord = () => mood.energy * 10 - 5;

  const addPoint = (x, y) => {
    setTrail(prev => [...prev, { x, y }]);
  };

  const getCoordsFromEvent = (e) => {
    const chart = chartRef.current;
    if (!chart) return null;

    const { left, top, width, height } = chart.getBoundingClientRect();

    // Subtract the internal recharts plot-area offsets from both
    // the mouse position and the available dimensions.
    const plotWidth  = width  - CHART_OFFSET_LEFT;
    const plotHeight = height - CHART_OFFSET_TOP;
    const mouseX = e.clientX - left - CHART_OFFSET_LEFT;
    const mouseY = e.clientY - top  - CHART_OFFSET_TOP;

    const xVal = (mouseX / plotWidth)  * 10 - 5;
    const yVal = 5 - (mouseY / plotHeight) * 10;

    if (xVal >= -5 && xVal <= 5 && yVal >= -5 && yVal <= 5) {
      return { xVal, yVal };
    }
    return null;
  };

  const handleClick = (e) => {
    const coords = getCoordsFromEvent(e);
    if (!coords) return;
    console.log("coords:", coords);

    const { xVal, yVal } = coords;
    const { valence, energy } = convertCoordsToMood(xVal, yVal);
    console.log("valence:", valence, "energy:", energy);

    updateMood({ valence, energy });
    if (trailEnabled) addPoint(xVal, yVal);
  };

  const handleMouseMove = (e) => {
    const coords = getCoordsFromEvent(e);
    if (!coords) {
      setHoverPoint(null);
      return;
    }
    const { xVal, yVal } = coords;
    setHoverPoint({
      x: Math.round(xVal),
      y: Math.round(yVal),
    });
  };

  return (
    <MoodEnergyChartWrapper>
      <div
        ref={chartRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        className={styles["chart-background"]}
        style={{ width: "100%", height: "100%", position: "relative" }}
      >
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <XAxis type="number" dataKey="x" domain={[-5, 5]} ticks={[]} hide />
            <YAxis type="number" dataKey="y" domain={[-5, 5]} ticks={[]} hide />

            <ReferenceLine x={0} stroke="black" strokeWidth={2} />
            <ReferenceLine y={0} stroke="black" strokeWidth={2} />

            {trailEnabled && trail.length > 0 && (
              <Line
                type="monotone"
                data={trail}
                dataKey="y"
                stroke="white"
                dot={false}
                isAnimationActive={false}
                strokeWidth={3}
                strokeOpacity={0.4}
              />
            )}

            {console.log("Mood in MoodEnergyChart Scatter Chart:", mood, "valence:", mood.valence, "energy:", mood.energy, "condition:", mood.valence != null && mood.energy != null)}
            {console.log("Coords inside MoodEnergyChart. x:", getSelectedXCoord(), "y:", getSelectedYCoord())}
            {mood.valence != null && mood.energy != null && (
              <ReferenceDot
                x={getSelectedXCoord()}
                y={getSelectedYCoord()}
                r={6}
                fill="black"
                stroke="black"
                strokeWidth={2}
              />
            )}
          </ScatterChart>
        </ResponsiveContainer>

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