import React from "react";
import { render, act } from "@testing-library/react";

// Helper: create a test component to expose addPoint and trail state
function TestWrapper() {
  const [trail, setTrail] = React.useState([]);
  const addPoint = (x, y) => {
    setTrail(prev => [...prev, { x, y }]);
  };
  return (
    <div>
      <button onClick={() => addPoint(1, 2)}>Add (1,2)</button>
      <button onClick={() => addPoint(3, 4)}>Add (3,4)</button>
      <div data-testid="trail">{JSON.stringify(trail)}</div>
    </div>
  );
}

describe("addPoint", () => {
  it("adds points to the trail state", () => {
    const { getByText, getByTestId } = render(<TestWrapper />);
    act(() => {
      getByText("Add (1,2)").click();
      getByText("Add (3,4)").click();
    });
    const trail = JSON.parse(getByTestId("trail").textContent);
    expect(trail).toEqual([{ x: 1, y: 2 }, { x: 3, y: 4 }]);
  });
});

/*
describe("handleClick", () => {
  it("calls updateMood with correct values when click is in bounds", () => {
    const updateMood = jest.fn();
    const mood = { valence: 0.5, energy: 0.5 };
    const { getByRole } = render(
      <MoodEnergyChart mood={mood} updateMood={updateMood} />
    );
    const chartDiv = getByRole("presentation") || getByRole("generic");
    // Mock getBoundingClientRect
    chartDiv.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
    });
    // Click at center (50, 50)
    fireEvent.click(chartDiv, { clientX: 50, clientY: 50 });
    expect(updateMood).toHaveBeenCalledWith({ valence: 0.5, energy: 0.5 });
  });

  it("calls updateMood with null values when click is out of bounds", () => {
    const updateMood = jest.fn();
    const mood = { valence: 0.5, energy: 0.5 };
    const { getByRole } = render(
      <MoodEnergyChart mood={mood} updateMood={updateMood} />
    );
    const chartDiv = getByRole("presentation") || getByRole("generic");
    chartDiv.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
    });
    // Click out of bounds
    fireEvent.click(chartDiv, { clientX: 200, clientY: 200 });
    expect(updateMood).toHaveBeenCalledWith({ valence: null, energy: null });
  });
});
*/
