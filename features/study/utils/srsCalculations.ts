const MaxDate = new Date(2500, 0, 1, 0, 0, 0, 0);

export const calcNewSrsLevel = (currentLevel: number, difference: number): number => {
	const roundedCurrentLevel = Math.floor(currentLevel);
	const newLevel = currentLevel + difference;
	if (roundedCurrentLevel === 0 && newLevel < 0) {
		return 0;
	} else if (roundedCurrentLevel === 1 && newLevel < 1) {
		return 1;
	} else {
		return newLevel;
	}
};

export const calcTimerBonus = (secondsElapsed: number): number => {
	if (secondsElapsed < 5) {
		return 0.2;
	} else if (secondsElapsed < 15) {
		return 0;
	} else {
		return -0.2;
	}
};

const addHoursToNow = (hours: number): Date => {
	const now = new Date();
	now.setMinutes(0, 0, 0);
	now.setHours(now.getHours() + hours);
	return now;
};

export const calcNextStudyDate = (currentSrsLevel: number): Date | null => {
	switch (Math.floor(currentSrsLevel)) {
		case 0:
			return addHoursToNow(4);
		case 1:
			return addHoursToNow(8);
		case 2:
			return addHoursToNow(24);
		case 3:
			return addHoursToNow(48);
		case 4:
			return addHoursToNow(168);
		case 5:
			return addHoursToNow(336);
		case 6:
			return addHoursToNow(672);
		case 7:
			return addHoursToNow(2688);
		case 8:
			return MaxDate;
	}
	return new Date();
};
