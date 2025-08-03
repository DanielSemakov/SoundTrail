import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import MoodEnergyChart from './MoodEnergyChart';

describe('MoodEnergyChart', () => {
  const defaultMood = { valence: 0.5, energy: 0.5 };
  const mockUpdateMood = jest.fn();

  beforeEach(() => {
    mockUpdateMood.mockClear();
  });

  test('renders with mood state and labels', () => {
    const { getByText } = render(
      <MoodEnergyChart updateMood={mockUpdateMood} mood={defaultMood} />
    );

    expect(getByText('Energetic')).toBeInTheDocument();
    expect(getByText('Calm')).toBeInTheDocument();
    expect(getByText('Sad')).toBeInTheDocument();
    expect(getByText('Happy')).toBeInTheDocument();
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
});
