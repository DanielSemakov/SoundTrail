// import styles from "./MoodEnergyChart.module.css";
// import React, { useRef, useState } from "react";
// import MoodEnergyChartWrapper from './MoodEnergyChartWrapper.js';
// import ChartLabel from './ChartLabel.js'

// import {
//   ScatterChart,
//   Scatter,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   ReferenceLine,
//   Label,
//   ReferenceDot,
//   Line,
//   Customized
// } from "recharts";

// /*In the graph, x-coords and y-coords range from -5 to 5. These values
// are converted into valence and energy values between 0 and 1. */

// const convertCoordsToMood = (x, y) => {
//   const valence = (x + 5) / 10;
//   const energy  = (y + 5) / 10;
//   return { valence, energy };
// };

// export default function MoodEnergyChart({ updateMood, mood, trailEnabled }) {
//   const ticks = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
//   const [hoverPoint, setHoverPoint] = useState(null);
//   const chartRef = useRef(null);

//   const getSelectedXCoord = () => {
//     return mood.valence * 10 - 5;
//   }

//   const getSelectedYCoord = () => {
//     return mood.energy * 10 - 5;
//   }

//   const [trail, setTrail] = useState([]);

//   const addPoint = (x, y) => {
//     setTrail(prev => [...prev, {x, y}]);
//   }

//   const handleClick = (e) => {
//     console.log("Raw click payload:", e);

//     const chart = chartRef.current;
//     if (!chart) return;
//     const { left, top, width, height } = chart.getBoundingClientRect();
//     const mouseX = e.clientX - left;
//     const mouseY = e.clientY - top;
//     const xVal = Math.round((mouseX / width) * 10 - 5);
//     const yVal = Math.round(5 - (mouseY / height) * 10);

//     console.log("Selected x and y values: (" + xVal + ", " + yVal + ")");

//     if (xVal >= -5 && xVal <= 5 && yVal >= -5 && yVal <= 5) {
//       const { valence, energy } = convertCoordsToMood(xVal, yVal);
//       console.log("MoodEnergyChart.js: Updated mood. New valence: " + valence + ". New energy: " + energy);
//       updateMood({ valence, energy });
//       //If mood is valid and trail is enabled, the trail will update accordingly
//       if (trailEnabled === true) {
//         addPoint(xVal, yVal);
//       }
//     } 
//   };

//   const handleMouseMove = (e) => {
//     const chart = chartRef.current;
//     if (!chart) return;
//     const { left, top, width, height } = chart.getBoundingClientRect();
//     const x = Math.round(((e.clientX - left) / width) * 10 - 5);
//     const y = Math.round(5 - ((e.clientY - top) / height) * 10);
//     setHoverPoint(
//       x >= -5 && x <= 5 && y >= -5 && y <= 5
//         ? { x, y }
//         : null
//     );
//   };

//   // build an 11×11 grid
//   const data = [];
//   for (let i = -5; i <= 5; i++) {
//     for (let j = -5; j <= 5; j++) {
//       data.push({ x: i, y: j });
//     }
//   }

//   return (
//       <MoodEnergyChartWrapper>
//         <div
//           ref={chartRef}
//           onClick={handleClick}
//           style={{
//             width: "100%",
//             height: "100%",
//             position: "relative", // ensure relative positioning
//             //Slight shift chart to the left so it aligns better in explore page
//             //since the label on the right side is slightly longer than that on the left side
//             // transform: 'translateX(-3%)'
//           }}
//           className={styles["chart-background"]}
//         >
//           {/* Chart */}
//           <ResponsiveContainer>
//             <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
//               <defs>
//                 <linearGradient id="blackToWhite" x1="0" y1="0" x2="1" y2="0">
//                   <stop offset="0%" stopColor="black" />
//                   <stop offset="100%" stopColor="white" />
//                 </linearGradient>
//               </defs>

//               <CartesianGrid stroke="rgba(0, 0, 0, 0.2)" />
//               <XAxis
//                 type="number"
//                 dataKey="x"
//                 domain={[-5, 5]}
//                 ticks={ticks}
//                 hide
//               />
//               <YAxis
//                 type="number"
//                 dataKey="y"
//                 domain={[-5, 5]}
//                 ticks={ticks}
//                 hide
//               />
//               <ReferenceLine x={0} stroke="black" strokeWidth={2} />
//               <ReferenceLine y={0} stroke="black" strokeWidth={2} />
//               <Tooltip cursor={{ strokeDasharray: "3 3" }} />
//               <Scatter data={data} fill="transparent" stroke="transparent" />

//               {trailEnabled && trail.length > 0 && (
//                 <>
//                   <Scatter
//                     name="Points"
//                     data={trail}
//                     hide
//                     data-testid="trail-scatter"
//                   />
//                   <Line
//                     type="monotone"
//                     data={trail}
//                     dataKey="y"
//                     stroke="white"
//                     dot={false}
//                     isAnimationActive={false}
//                     strokeWidth={3}
//                     strokeOpacity={0.4}
//                   />
//                 </>
//               )}

//               {mood.valence != null && mood.energy != null && (
//                 <ReferenceDot
//                   x={getSelectedXCoord()}
//                   y={getSelectedYCoord()}
//                   r={6}
//                   fill="black"
//                   stroke="black"
//                   strokeWidth={2}
//                 />
//               )}
//             </ScatterChart>
//           </ResponsiveContainer>

//           {/* Top Label */}
//           <div
//             style={{
//               position: "absolute",
//               top: "-30px",
//               left: "50%",
//               transform: "translateX(-50%)",
//               fontWeight: "bold",
//             }}
//           >
//             Energetic
//           </div>

//           {/* Bottom Label */}
//           <div
//             style={{
//               position: "absolute",
//               bottom: "-30px",
//               left: "50%",
//               transform: "translateX(-50%)",
//               fontWeight: "bold",
//             }}
//           >
//             Calm
//           </div>

//           {/* Left Label */}
//           <div
//             style={{
//               position: "absolute",
//               top: "50%",
//               left: "-43px",
//               transform: "translateY(-50%)",
//               fontWeight: "bold",
//             }}
//           >
//             Sad
//           </div>

//           {/* Right Label */}
//           <div
//             style={{
//               position: "absolute",
//               top: "50%",
//               right: "-63px",
//               transform: "translateY(-50%)",
//               fontWeight: "bold",
//             }}
//           >
//             Happy
//           </div>
//         </div>
//       </MoodEnergyChartWrapper>
//   );
// }


/*
Here's the latest 'draft' of my mood-energy chart. I used AI to remove all the visual gridlines.
 (I also got rid of the margins of the ScatterChart.)

Then I changed the handleClick function so that it no longer estimates the user's selected coordinate
to the nearest tenths place (based on my own coord system). But it might cause problems so maybe I should
estimate to the thousandths or ten thousandths place or something.

Also, there's a weird issue where the point that shows up on the grid when the user clicks on it is
slightly off. Maybe this isn't is a huge issue and I should leave it as is, but I would like to fix it.

The closer to the top of the chart u click, the lower the point is relative to where u clicked.
The closer to the bottom, the higher the point is relative to where u clicked.
The closer to the right, the more left the point is relative to where u clicked.
The closer to the left, the more right the point is relative to where u clicked.

Fig out why this is and how to fix it. I don't think I can simply shift the x and y values by
some constant amount b/c it differs between chart quadrants.

Also fig out how to change design of chart (if at all) given that, without the grid lines, it maybe
looks excessively colorful (gaudy) now.



*/


// import styles from "./MoodEnergyChart.module.css";
// import React, { useRef, useState } from "react";
// import MoodEnergyChartWrapper from './MoodEnergyChartWrapper.js';

// import {
//   ScatterChart,
//   XAxis,
//   YAxis,
//   ResponsiveContainer,
//   ReferenceLine,
//   ReferenceDot,
//   Line
// } from "recharts";

// /* Convert chart coords (-5 to 5) → mood values (0 to 1) */
// const convertCoordsToMood = (x, y) => {
//   const valence = (x + 5) / 10;
//   const energy  = (y + 5) / 10;
//   return { valence, energy };
// };

// export default function MoodEnergyChart({ updateMood, mood, trailEnabled }) {
//   const chartRef = useRef(null);
//   const [trail, setTrail] = useState([]);
//   const [hoverPoint, setHoverPoint] = useState(null);

//   const getSelectedXCoord = () => mood.valence * 10 - 5;
//   const getSelectedYCoord = () => mood.energy * 10 - 5;

//   const addPoint = (x, y) => {
//     setTrail(prev => [...prev, { x, y }]);
//   };

//   const handleClick = (e) => {
//     const chart = chartRef.current;
//     if (!chart) return;

//     const { left, top, width, height } = chart.getBoundingClientRect();
//     const mouseX = e.clientX - left;
//     const mouseY = e.clientY - top;

//     let xVal = (mouseX / width) * 10 - 5;
//     // xVal = Math.round(xVal * 1000) / 1000;

//     let yVal = 5 - (mouseY / height) * 10;
//     // yVal = Math.round(yVal * 1000) / 1000;

//     if (xVal >= -5 && xVal <= 5 && yVal >= -5 && yVal <= 5) {
//       const { valence, energy } = convertCoordsToMood(xVal, yVal);
//       updateMood({ valence, energy });

//       if (trailEnabled) addPoint(xVal, yVal);
//     }
//   };

//   const handleMouseMove = (e) => {
//     const chart = chartRef.current;
//     if (!chart) return;

//     const { left, top, width, height } = chart.getBoundingClientRect();
//     const x = Math.round(((e.clientX - left) / width) * 10 - 5);
//     const y = Math.round(5 - ((e.clientY - top) / height) * 10);

//     setHoverPoint(
//       x >= -5 && x <= 5 && y >= -5 && y <= 5 ? { x, y } : null
//     );
//   };

//   return (
//     <MoodEnergyChartWrapper>
//       <div
//         ref={chartRef}
//         onClick={handleClick}
//         onMouseMove={handleMouseMove}
//         className={styles["chart-background"]}
//         style={{
//           width: "100%",
//           height: "100%",
//           position: "relative"
//         }}
//       >
//         <ResponsiveContainer>
//           {/* <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}> */}
//            <ScatterChart>

//             {/* Axes (hidden, no ticks) */}
//             <XAxis
//               type="number"
//               dataKey="x"
//               domain={[-5, 5]}
//               ticks={[]}
//               hide
//             />
//             <YAxis
//               type="number"
//               dataKey="y"
//               domain={[-5, 5]}
//               ticks={[]}
//               hide
//             />

//             {/* Center crosshair */}
//             <ReferenceLine x={0} stroke="black" strokeWidth={2} />
//             <ReferenceLine y={0} stroke="black" strokeWidth={2} />

//             {/* Trail */}
//             {trailEnabled && trail.length > 0 && (
//               <Line
//                 type="monotone"
//                 data={trail}
//                 dataKey="y"
//                 stroke="white"
//                 dot={false}
//                 isAnimationActive={false}
//                 strokeWidth={3}
//                 strokeOpacity={0.4}
//               />
//             )}

//             {/* Current mood dot */}
//             {mood.valence != null && mood.energy != null && (
//               <ReferenceDot
//                 x={getSelectedXCoord()}
//                 y={getSelectedYCoord()}
//                 r={6}
//                 fill="black"
//                 stroke="black"
//                 strokeWidth={2}
//               />
//             )}
//           </ScatterChart>
//         </ResponsiveContainer>

//         {/* Labels */}
//         <div style={{
//           position: "absolute",
//           top: "-30px",
//           left: "50%",
//           transform: "translateX(-50%)",
//           fontWeight: "bold"
//         }}>
//           Energetic
//         </div>

//         <div style={{
//           position: "absolute",
//           bottom: "-30px",
//           left: "50%",
//           transform: "translateX(-50%)",
//           fontWeight: "bold"
//         }}>
//           Calm
//         </div>

//         <div style={{
//           position: "absolute",
//           top: "50%",
//           left: "-43px",
//           transform: "translateY(-50%)",
//           fontWeight: "bold"
//         }}>
//           Sad
//         </div>

//         <div style={{
//           position: "absolute",
//           top: "50%",
//           right: "-63px",
//           transform: "translateY(-50%)",
//           fontWeight: "bold"
//         }}>
//           Happy
//         </div>
//       </div>
//     </MoodEnergyChartWrapper>
//   );
// }

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
    const { xVal, yVal } = coords;
    const { valence, energy } = convertCoordsToMood(xVal, yVal);
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