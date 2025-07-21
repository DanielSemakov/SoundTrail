import { renderHook } from '@testing-library/react'
import useMoodKeyControls from "./useMoodKeyControls"


// describe('useMoodKeyControls', () => {
//   it('when ArrowUp is pressed and energy is currently <= 0.9, should call setMood and increase energy by 0.1 ', () => {
//     const mood = { valence: 0.4, energy: 0.2 };                        
//     const setMood = jest.fn(); 

//     renderHook(() => useMoodKeyControls(mood, setMood));             

//     window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' })); 

//     expect(setMood).toHaveBeenCalledWith({ valence: 0.4, energy: 0.3});
//   });
// });

describe('useMoodKeyControls', () => {
  it('when ArrowUp is pressed and energy is currently <= 0.9, should call setMood and increase energy by 0.1', () => {
    const mood = { valence: 0.4, energy: 0.2 };
    const setMood = jest.fn();

    renderHook(() => useMoodKeyControls(mood, setMood));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

    expect(setMood).toHaveBeenCalledTimes(1);

    //Get the function passed to setMood, which is used to update the mood
    const updaterFn = setMood.mock.calls[0][0];

    const newMood = updaterFn(mood);
    expect(newMood).toEqual({ valence: 0.4, energy: 0.3 });
  });
});

describe('useMoodKeyControls', () => {
  it('when ArrowUp is pressed and energy is currently 1, should call setMood and input same energy of 1', () => {
    const mood = { valence: 0.4, energy: 1 };
    const setMood = jest.fn();

    renderHook(() => useMoodKeyControls(mood, setMood));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

    expect(setMood).toHaveBeenCalledTimes(1);

    //Get the function passed to setMood, which is used to update the mood
    const updaterFn = setMood.mock.calls[0][0];

    const newMood = updaterFn(mood);
    expect(newMood).toEqual({ valence: 0.4, energy: 1 });
  });
});


describe('useMoodKeyControls', () => {
  it('when ArrowDown is pressed and energy is currently >= 0.1, should call setMood and decrease energy by 0.1', () => {
    const mood = { valence: 0.7, energy: 0.1 };
    const setMood = jest.fn();

    renderHook(() => useMoodKeyControls(mood, setMood));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

    expect(setMood).toHaveBeenCalledTimes(1);

    //Get the function passed to setMood, which is used to update the mood
    const updaterFn = setMood.mock.calls[0][0];

    const newMood = updaterFn(mood);
    expect(newMood).toEqual({ valence: 0.7, energy: 0 });
  });
});

describe('useMoodKeyControls', () => {
  it('when ArrowDown is pressed and energy is currently 0, should call setMood and input same energy of 0', () => {
    const mood = { valence: 1, energy: 0 };
    const setMood = jest.fn();

    renderHook(() => useMoodKeyControls(mood, setMood));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

    expect(setMood).toHaveBeenCalledTimes(1);

    //Get the function passed to setMood, which is used to update the mood
    const updaterFn = setMood.mock.calls[0][0];

    const newMood = updaterFn(mood);
    expect(newMood).toEqual({ valence: 1, energy: 0 });
  });
});

describe('useMoodKeyControls', () => {
  it('when ArrowRight is pressed and valence is currently <= 0.9, should call setMood and increase valence by 0.1', () => {
    const mood = { valence: 0.5, energy: 0.8 };
    const setMood = jest.fn();

    renderHook(() => useMoodKeyControls(mood, setMood));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

    expect(setMood).toHaveBeenCalledTimes(1);

    //Get the function passed to setMood, which is used to update the mood
    const updaterFn = setMood.mock.calls[0][0];

    const newMood = updaterFn(mood);
    expect(newMood).toEqual({ valence: 0.6, energy: 0.8 });
  });
});

describe('useMoodKeyControls', () => {
  it('when ArrowRight is pressed and valence is currently 1, should call setMood and input same valence of 1', () => {
    const mood = { valence: 1, energy: 0.6 };
    const setMood = jest.fn();

    renderHook(() => useMoodKeyControls(mood, setMood));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

    expect(setMood).toHaveBeenCalledTimes(1);

    //Get the function passed to setMood, which is used to update the mood
    const updaterFn = setMood.mock.calls[0][0];

    const newMood = updaterFn(mood);
    expect(newMood).toEqual({ valence: 1, energy: 0.6 });
  });
});

describe('useMoodKeyControls', () => {
  it('when ArrowLeft is pressed and valence is currently >= 0.1, should call setMood and decrease valence by 0.1', () => {
    const mood = { valence: 1, energy: 0.1 };
    const setMood = jest.fn();

    renderHook(() => useMoodKeyControls(mood, setMood));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));

    expect(setMood).toHaveBeenCalledTimes(1);

    //Get the function passed to setMood, which is used to update the mood
    const updaterFn = setMood.mock.calls[0][0];

    const newMood = updaterFn(mood);
    expect(newMood).toEqual({ valence: 0.9, energy: 0.1 });
  });
});

describe('useMoodKeyControls', () => {
  it('when ArrowLeft is pressed and valence is currently 0, should call setMood and input same valence of 0', () => {
    const mood = { valence: 0, energy: 0.5 };
    const setMood = jest.fn();

    renderHook(() => useMoodKeyControls(mood, setMood));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));

    expect(setMood).toHaveBeenCalledTimes(1);

    //Get the function passed to setMood, which is used to update the mood
    const updaterFn = setMood.mock.calls[0][0];

    const newMood = updaterFn(mood);
    expect(newMood).toEqual({ valence: 0, energy: 0.5 });
  });
});