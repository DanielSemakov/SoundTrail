import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import MoodEnergyChart from './MoodEnergyChart';

// Helper to get the chart div for click simulation
function getChartDiv(container) {
  // The chart's clickable div is the first child of MoodEnergyChartWrapper
  return container.querySelector('div[style]');
}

describe('MoodEnergyChart', () => {
  const defaultMood = { valence: 0.5, energy: 0.5 };
  const mockUpdateMood = jest.fn();

  beforeEach(() => {
    mockUpdateMood.mockClear();
  });

  test('calls updateMood when clicked within bounds', () => {
    const { container } = render(
      <MoodEnergyChart updateMood={mockUpdateMood} mood={defaultMood} />
    );

    const chartDiv = container.querySelector('div[class*="chart-background"]');

    fireEvent.click(chartDiv, {
      clientX: chartDiv.getBoundingClientRect().left + chartDiv.clientWidth / 2,
      clientY: chartDiv.getBoundingClientRect().top + chartDiv.clientHeight / 2,
    });

    expect(mockUpdateMood).toHaveBeenCalledTimes(1);
    const moodArg = mockUpdateMood.mock.calls[0][0];
    expect(moodArg.valence).toBeGreaterThanOrEqual(0);
    expect(moodArg.valence).toBeLessThanOrEqual(1);
    expect(moodArg.energy).toBeGreaterThanOrEqual(0);
    expect(moodArg.energy).toBeLessThanOrEqual(1);
  });

  test('calls updateMood with null values when clicked out of bounds', () => {
    const { container } = render(
      <MoodEnergyChart updateMood={mockUpdateMood} mood={defaultMood} />
    );

    const chartDiv = container.querySelector('div[class*="chart-background"]');

    fireEvent.click(chartDiv, {
      clientX: chartDiv.getBoundingClientRect().left - 100,
      clientY: chartDiv.getBoundingClientRect().top - 100,
    });

    expect(mockUpdateMood).toHaveBeenCalledWith({ valence: null, energy: null });
  });

  test('updates trail state and renders Line when trailEnabled is true', () => {
    const { container } = render(
      <MoodEnergyChart updateMood={mockUpdateMood} mood={defaultMood} trailEnabled={true} />
    );

    const chartDiv = getChartDiv(container);

    // Simulate two clicks within bounds to add two points to the trail
    act(() => {
      fireEvent.click(chartDiv, {
        clientX: chartDiv.getBoundingClientRect().left + chartDiv.clientWidth * 0.25,
        clientY: chartDiv.getBoundingClientRect().top + chartDiv.clientHeight * 0.25,
      });
      fireEvent.click(chartDiv, {
        clientX: chartDiv.getBoundingClientRect().left + chartDiv.clientWidth * 0.75,
        clientY: chartDiv.getBoundingClientRect().top + chartDiv.clientHeight * 0.75,
      });
    });

    // The Line should be rendered in the chart (by class name from recharts)
    const line = container.querySelector('.recharts-line');
    expect(line).toBeInTheDocument();

    // The trail points should be rendered as dots (by class name from recharts)
    const trailDots = container.querySelectorAll('.recharts-scatter .recharts-dot');
    expect(trailDots.length).toBeGreaterThanOrEqual(2);
  });
});
