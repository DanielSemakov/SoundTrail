import "./MoodEnergyChart.module.css"
import React, { useRef, useState } from "react";
import MoodEnergyChartWrapper from './MoodEnergyChartWrapper';

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
  Line,
  ReferenceDot
} from "recharts";

/*In the graph, x-coords and y-coords range from -5 to 5. These values
are converted into valence and energy values between 0 and 1. */

// export function valenceToX(valence) {
//   return valence * 10 - 5;
// }

// export function energyToY(energy) {
//   return energy * 10 - 5;
// }


// export function valenceToX(valence) {
//   return valence * 10 - 5;
// }

const convertCoordsToMood = (x, y) => {
  const valence = (x + 5) / 10;
  const energy  = (y + 5) / 10;
  return { valence, energy };
};

// trailEnabled is a boolean. Set it to True in ExplorePage.js. Set it to False in LandingPage.js. 
export default function MoodEnergyChart({ updateMood, mood, trailEnabled }) {
  const ticks = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
  const [hoverPoint, setHoverPoint] = useState(null);
  const chartRef = useRef(null);

  const getSelectedXCoord = () => {
    return mood.valence * 10 - 5;
  }

  const getSelectedYCoord = () => {
    return mood.energy * 10 - 5;
  }

  const [trail, setTrail] = useState([]);

  const addPoint = (x, y) => {
    setTrail(prev => [...prev, {x, y}]);
  }

  const handleClick = (e) => {
    const chart = chartRef.current;
    if (!chart) return;
    const { left, top, width, height } = chart.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;
    const x = Math.round((mouseX / width) * 10 - 5);
    const y = Math.round(5 - (mouseY / height) * 10);

    if (x >= -5 && x <= 5 && y >= -5 && y <= 5) {
      const { valence, energy } = convertCoordsToMood(x, y);
      updateMood({ valence, energy });
      //If mood is valid and trail is enabled, the trail will update accordingly
      if (trailEnabled == true) {
        addPoint(x, y);
      }
    } else {
      updateMood({ valence: null, energy: null });
    }
  };

  const handleMouseMove = (e) => {
    const chart = chartRef.current;
    if (!chart) return;
    const { left, top, width, height } = chart.getBoundingClientRect();
    const x = Math.round(((e.clientX - left) / width) * 10 - 5);
    const y = Math.round(5 - ((e.clientY - top) / height) * 10);
    setHoverPoint(
      x >= -5 && x <= 5 && y >= -5 && y <= 5
        ? { x, y }
        : null
    );
  };

  // build an 11×11 grid
  const data = [];
  for (let i = -5; i <= 5; i++) {
    for (let j = -5; j <= 5; j++) {
      data.push({ x: i, y: j });
    }
  }

  return (
    <MoodEnergyChartWrapper>
      <div
        ref={chartRef}
        onClick={handleClick}
        //onMouseMove={handleMouseMove}
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <CartesianGrid />
            <XAxis
              type="number"
              dataKey="x"
              domain={[-5, 5]}
              ticks={ticks}
              hide
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[-5, 5]}
              ticks={ticks}
              hide
            />
            <ReferenceLine x={0} stroke="black" strokeWidth={2} />
            <ReferenceLine y={0} stroke="black" strokeWidth={2} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter data={data} fill="#eee" />

            {/ Below is the scatter plot used for the history */}
            {/ Data passed to it is the "trail" array state created earlier */}
            <Scatter name="Points" data={trail} fill="#8884d8" />
            {/ Below is the line connecting the history, using "trail" */}
            <Line
              type="monotone"
              data={trail}
              dataKey="y"
              stroke="#ff7300"
              dot={false}
              isAnimationActive={false}
            />
            {/* {hoverPoint && (
              <ReferenceDot
                x={hoverPoint.x}
                y={hoverPoint.y}
                r={6}
                fill="black"
                stroke="black"
                strokeWidth={2}
              />
            )} */}
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
      </div>
      <div style={{ marginTop: 20, fontSize: 18 }}>
        {hoverPoint
          ? `Hovered Point: x = ${hoverPoint.x}, y = ${hoverPoint.y}`
          : "Hover over a point to see its coordinates"}
      </div>
    </MoodEnergyChartWrapper>
  );
}
