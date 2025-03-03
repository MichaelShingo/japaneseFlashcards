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
};

const initialState = {
	value: {
		snackBarData: { isOpen: false, message: '' },
		colorMode: 'dark',
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
	},
});

export const { setSnackBarData, setColorMode } = global.actions;
export default global.reducer;
