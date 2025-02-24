import { Button } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';

const Timer: React.FC = () => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsElapsed(prevSeconds => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const minutes = Math.floor(secondsElapsed / 60);
  const seconds = secondsElapsed % 60;

  const toggleTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else {
      intervalRef.current = setInterval(() => {
        setSecondsElapsed(prevSeconds => prevSeconds + 1);
      }, 1000);
    }
    setIsPaused((value) => !value);
  };

  const generateColor = (): 'success' | 'warning' | 'error' => {
    if (secondsElapsed < 5) {
      return 'success';
    } else if (secondsElapsed < 15) {
      return 'warning';
    } else {
      return 'error';
    }
  };

  return (
    <Button
      color={generateColor()}
      onClick={toggleTimer}
      className={isPaused && 'animate-flicker-opacity'}
    >
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </Button>
  );
};

export default Timer;