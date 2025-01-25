import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
	value: WindowState;
};

type WindowState = {
	windowHeight: number;
	windowWidth: number;
	isCursorInWindow: boolean;
};

const initialState = {
	value: {
		windowHeight: 0,
		windowWidth: 0,
		isCursorInWindow: false,
	} as WindowState,
} as InitialState;

export const window = createSlice({
	name: 'window',
	initialState: initialState,
	reducers: {
		setHeight: (state, action: PayloadAction<number>) => {
			state.value.windowHeight = action.payload;
		},
		setWidth: (state, action: PayloadAction<number>) => {
			state.value.windowWidth = action.payload;
		},
		setIsCursorInWindow: (state, action: PayloadAction<boolean>) => {
			state.value.isCursorInWindow = action.payload;
		},
	},
});

export const { setHeight, setWidth, setIsCursorInWindow } = window.actions;
export default window.reducer;
