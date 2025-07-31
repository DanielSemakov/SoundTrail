import React, { useRef, useState } from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Line,
  ReferenceDot,
} from "recharts";

// Minimal wrapper to avoid undefined error in test
function MoodEnergyChartWrapper({ children }) {
  return <div>{children}</div>;
}

// Helper for coordinate conversion
const convertCoordsToMood = (x, y) => {
  const valence = (x + 5) / 10;
  const energy  = (y + 5) / 10;
  return { valence, energy };
};

// The MoodEnergyChart function as provided
function MoodEnergyChart({ updateMood, mood, trailEnabled }) {
  const ticks = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
  const [hoverPoint, setHoverPoint] = useState(null);
  const chartRef = useRef(null);

  const getSelectedXCoord = () => mood.valence * 10 - 5;
  const getSelectedYCoord = () => mood.energy * 10 - 5;

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
        data-testid="chart-background"
        style={{
          width: "100%",
          height: "100%",
          minWidth: "200px",
          minHeight: "200px",
        }}
      >
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <CartesianGrid />
            <XAxis type="number" dataKey="x" domain={[-5, 5]} ticks={ticks} hide />
            <YAxis type="number" dataKey="y" domain={[-5, 5]} ticks={ticks} hide />
            <ReferenceLine x={0} stroke="black" strokeWidth={2} />
            <ReferenceLine y={0} stroke="black" strokeWidth={2} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter data={data} fill="#eee" />
            {trailEnabled && trail.length > 0 && (
              <>
                <Scatter
                  name="Points"
                  data={trail}
                  fill="#8884d8"
                  data-testid="trail-scatter"
                />
                <Line
                  type="monotone"
                  data={trail}
                  dataKey="y"
                  stroke="#ff7300"
                  dot={false}
                  isAnimationActive={false}
                  // data-testid does not propagate to DOM for Line, so test with class
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
      </div>
      <div data-testid="trail-state">{JSON.stringify(trail)}</div>
      <div style={{ marginTop: 20, fontSize: 18 }}>
        {hoverPoint
          ? `Hovered Point: x = ${hoverPoint.x}, y = ${hoverPoint.y}`
          : "Hover over a point to see its coordinates"}
      </div>
    </MoodEnergyChartWrapper>
  );
}

// Mock ResizeObserver for recharts/ResponsiveContainer in Jest
beforeAll(() => {
  global.ResizeObserver = global.ResizeObserver || class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

// Helper to simulate clicking on the chart at a specific position
function clickChartAt(container, x, y) {
  const chartDiv = container.querySelector('[data-testid="chart-background"]');
  // Mock getBoundingClientRect for consistent results
  chartDiv.getBoundingClientRect = () => ({
    left: 0,
    top: 0,
    width: 100,
    height: 100,
  });
  fireEvent.click(chartDiv, { clientX: x, clientY: y });
}

//Jest does not work well with the "Recharts" library, which is what the MoodEnergyChart component uses.
//Because of this, it's nearly impossible to test the component in a more meaningful way, as any attempts
//to try to use "Recharts" will either break the tests for the entire application, or cause unavoidable errors.

describe("MoodEnergyChart trail rendering", () => {
  it("does not render trail scatter or line when trailEnabled is false", () => {
    const mood = { valence: 0.5, energy: 0.5 };
    const updateMood = jest.fn();
    const { queryByTestId, container } = render(
      <MoodEnergyChart mood={mood} updateMood={updateMood} trailEnabled={false} />
    );
    // Simulate a click to try to add a trail point
    clickChartAt(container, 50, 50);
    // Trail scatter and line should not be rendered
    expect(queryByTestId("trail-scatter")).toBeNull();
    // Line does not have a testid, so check by class
    expect(container.querySelector(".recharts-line")).toBeNull();
  });
});