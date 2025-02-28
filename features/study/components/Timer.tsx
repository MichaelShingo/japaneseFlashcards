import { Button } from '@mui/material';
import React, { useState, useEffect, useRef, SetStateAction, FC, Dispatch } from 'react';

interface TimerProps {
	secondsElapsed: number;
	setSecondsElapsed: Dispatch<SetStateAction<number>>;
	isAnswered: boolean;
}
const Timer: FC<TimerProps> = ({ secondsElapsed, setSecondsElapsed, isAnswered }) => {
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const [isPaused, setIsPaused] = useState<boolean>(false);

	useEffect(() => {
		intervalRef.current = setInterval(() => {
			setSecondsElapsed((prevSeconds) => prevSeconds + 1);
		}, 1000);

		return () => clearInterval(intervalRef.current);
	}, []);

	useEffect(() => {
		if (secondsElapsed === 0 && isPaused) {
			toggleTimer();
		}
	}, [secondsElapsed, isPaused]);

	useEffect(() => {
		if (isAnswered && !isPaused) {
			toggleTimer();
		}
	}, [isAnswered]);

	const minutes = Math.floor(secondsElapsed / 60);
	const seconds = secondsElapsed % 60;

	const toggleTimer = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		} else {
			intervalRef.current = setInterval(() => {
				setSecondsElapsed((prevSeconds) => prevSeconds + 1);
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
			disabled={isAnswered}
			color={generateColor()}
			onClick={toggleTimer}
			// className={isPaused && !isAnswered && 'animate-flicker-opacity'}
		>
			{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
		</Button>
	);
};

export default Timer;
