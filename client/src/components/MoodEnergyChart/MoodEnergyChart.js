import styles from "./MoodEnergyChart.module.css";
import React, { useRef, useState } from "react";
import MoodEnergyChartWrapper from './MoodEnergyChartWrapper.js';
import ChartLabel from './ChartLabel.js'

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
  ReferenceDot,
  Line,
  Customized
} from "recharts";

/*In the graph, x-coords and y-coords range from -5 to 5. These values
are converted into valence and energy values between 0 and 1. */

const convertCoordsToMood = (x, y) => {
  const valence = (x + 5) / 10;
  const energy  = (y + 5) / 10;
  return { valence, energy };
};

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
      if (trailEnabled === true) {
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
          style={{
            width: "100%",
            height: "100%",
            position: "relative", // ensure relative positioning
          }}
          className={styles["chart-background"]}
        >
          {/* Chart */}
          <ResponsiveContainer>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <defs>
                <linearGradient id="blackToWhite" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="black" />
                  <stop offset="100%" stopColor="white" />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="rgba(0, 0, 0, 0.2)" />
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
              <Scatter data={data} fill="transparent" stroke="transparent" />

              {trailEnabled && trail.length > 0 && (
                <>
                  <Scatter
                    name="Points"
                    data={trail}
                    hide
                    data-testid="trail-scatter"
                  />
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
                </>
              )}

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

          {/* Top Label */}
          <div
            style={{
              position: "absolute",
              top: "-30px",
              left: "50%",
              transform: "translateX(-50%)",
              fontWeight: "bold",
            }}
          >
            Energetic
          </div>

          {/* Bottom Label */}
          <div
            style={{
              position: "absolute",
              bottom: "-30px",
              left: "50%",
              transform: "translateX(-50%)",
              fontWeight: "bold",
            }}
          >
            Calm
          </div>

          {/* Left Label */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "-43px",
              transform: "translateY(-50%)",
              fontWeight: "bold",
            }}
          >
            Sad
          </div>

          {/* Right Label */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: "-63px",
              transform: "translateY(-50%)",
              fontWeight: "bold",
            }}
          >
            Happy
          </div>
        </div>
      </MoodEnergyChartWrapper>
  );
}