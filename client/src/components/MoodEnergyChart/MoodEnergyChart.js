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
  ReferenceDot
} from "recharts";

/*In the graph, x-coords and y-coords range from -5 to 5. These values
are converted into valence and energy values between 0 and 1. */

export function valenceToX(valence) {
  return (valence * 10) - 5
}

export function energyToY(energy) {
  return (energy * 10) - 5
}

const convertCoordsToMood = (x, y) => {
  const valence = (x + 5) / 10;
  const energy = (y + 5) / 10;

  return { valence, energy };
}



export default function MoodEnergyChart({ valence, energy, updateMood }) {
  const ticks = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];

  const handleClick = (e) => {
  const chart = chartRef.current;
  if (!chart) return;

  const { left, top, width, height } = chart.getBoundingClientRect();
  const mouseX = e.clientX - left;
  const mouseY = e.clientY - top;

  const x = Math.round(((mouseX / width) * 10) - 5);
  const y = Math.round(5 - (mouseY / height) * 10);

  if (x >= -5 && x <= 5 && y >= -5 && y <= 5) {
    const { valence, energy } = convertCoordsToMood(x, y);
    updateMood({valence, energy});
  } else {
    updateMood({valence: null, eneryg: null});
  }
};

  //hoverPoint stores the integer coordinate that is closest to where the user
  //is hovering their mouse over the graph (e.g. {x: 3, y: 2}). Coordinates range
  //from -5 to 5.
  const [hoverPoint, setHoverPoint] = useState(null);
  const chartRef = useRef(null);

  const handleMouseMove = (e) => {
    const chart = chartRef.current;
    if (!chart) return;

    const { left, top, width, height } = chart.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    const x = Math.round(((mouseX / width) * 10) - 5);
    const y = Math.round(5 - (mouseY / height) * 10); // invert Y axis

    if (x >= -5 && x <= 5 && y >= -5 && y <= 5) {
      setHoverPoint({ x, y });
    } else {
      setHoverPoint(null);
    }
  };

  return (
    <div
      ref={chartRef}
      onMouseMove={handleMouseMove}
      style={{ 
        width: '60vmin', 
        height: '60vmin', 
        border: "2px dashed red",
        background: `
          linear-gradient(to top, green, transparent 60%),
          linear-gradient(to bottom, red, transparent 60%),
          linear-gradient(to left, yellow, transparent 100%),
          linear-gradient(to right, blue, transparent 60%)
        `,
    backgroundBlendMode: "multiply",
       }}
      onClick={handleClick}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart 
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <CartesianGrid />
          <XAxis
            type="number"
            dataKey="x"
            name="valence"
            domain={[-5, 5]}
            ticks={ticks}
            tick={() => null}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            hide={true}
            tickFormatter={() => ''}
          >
            {/* <Label value="Happy" position="right" dy={-540} dx={30} style={{ fontSize: 60, fontWeight: 'bold'}} />
            <Label value="Sad" postion="left" dx={-650} dy={-600} style={{ fontSize: 60, fontWeight: 'bold' }}/> */}
          </XAxis>
          <YAxis
            type="number"
            dataKey="y"
            name="energy"
            domain={[-5, 5]}
            ticks={ticks}
            tick={() => null}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            hide={true}
            tickFormatter={() => ''}
          >
            {/* <Label value="Energetic" postion="top" dx={650} dy={-630} style={{ fontSize: 60, fontWeight: 'bold'}} />

            <Label value="Calm" postion="bottom" dx={200} dy={180}/> */}
          </YAxis>
          <ReferenceLine x={0} stroke="black" strokeWidth={2} />
          <ReferenceLine y={0} stroke="black" strokeWidth={2} />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={[]} 
          fill="transparent" />

          {valence !== null && energy !== null && (
            <ReferenceDot
              x={valenceToX(valence)}
              y={energyToY(energy)}
              r={6} //radius of the dot in pixels
              fill="black" //fill color of the circle
              stroke="black" //optional outline color
              strokeWidth={2} //thickness of the outline
              isFront={true} //makes sure the dot is drawn above gridlines
            />
          )}

        </ScatterChart>
      </ResponsiveContainer>

      <div style={{ marginTop: 20, textAlign: "center", fontSize: 18 }}>
        {hoverPoint
          ? `Hovered Point: x = ${hoverPoint.x}, y = ${hoverPoint.y}`
          : "Hover over a point to see its coordinates"}
      </div>
    </div>
  );
}



