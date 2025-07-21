// client/src/components/GenreSelector.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; 

import GenreSelector from './GenreSelector'; // Component to be tested

describe('GenreSelector', () => {
  // Test case: Renders with initial prop value
  test('renders with the initial genre selected', () => {
    const initialGenre = 'pop';
    const mockSetGenre = jest.fn(); // Mock function for prop

    render(<GenreSelector genre={initialGenre} setGenre={mockSetGenre} />);

    const selectElement = screen.getByRole('combobox'); // Get the <select> element
    
    expect(selectElement).toBeInTheDocument(); // Check if rendered
    expect(selectElement).toHaveValue(initialGenre); // Check initial value
  });

  // Test case: Verifies `setGenre` call on selection change
  test('calls setGenre with the correct value when a new option is selected', () => {
    const initialGenre = '83dc71c7-b9da-466b-a198-bb3c29ee8f00'; 
    const mockSetGenre = jest.fn(); 

    render(<GenreSelector genre={initialGenre} setGenre={mockSetGenre} />);

    const selectElement = screen.getByRole('combobox');

    fireEvent.change(selectElement, { target: { value: 'rock' } }); // Simulate 'rock' selection

    expect(mockSetGenre).toHaveBeenCalledTimes(1); // Check if called once
    expect(mockSetGenre).toHaveBeenCalledWith('rock'); // Check if called with correct value
  });

  // Test case: Another selection to ensure consistent behavior
  test('calls setGenre with "jazz" when Jazz option is selected', () => {
    const initialGenre = 'pop'; 
    const mockSetGenre = jest.fn();

    render(<GenreSelector genre={initialGenre} setGenre={mockSetGenre} />);

    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'jazz' } }); // Simulate 'jazz' selection

    expect(mockSetGenre).toHaveBeenCalledTimes(1);
    expect(mockSetGenre).toHaveBeenCalledWith('jazz');
  });
});