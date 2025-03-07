import { Card } from '@prisma/client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
	value: GlobalState;
};

export type SnackbarData = {
	isOpen: boolean;
	message: string;
};

export type ColorMode = 'light' | 'dark';
type GlobalState = {
	snackBarData: SnackbarData;
	colorMode: ColorMode;
	currentStudyCardIds: number[];
};

const initialState = {
	value: {
		snackBarData: { isOpen: false, message: '' },
		colorMode: 'dark',
		currentStudyCardIds: [],
	} as GlobalState,
} as InitialState;

export const global = createSlice({
	name: 'global',
	initialState: initialState,
	reducers: {
		setSnackBarData: (state, action: PayloadAction<SnackbarData>) => {
			state.value.snackBarData = action.payload;
		},
		setColorMode: (state, action: PayloadAction<ColorMode>) => {
			state.value.colorMode = action.payload;
		},
		setCurrentStudyCards: (state, action: PayloadAction<number[]>) => {
			state.value.currentStudyCardIds = action.payload;
		},
	},
});

export const { setSnackBarData, setColorMode, setCurrentStudyCards } = global.actions;
export default global.reducer;
