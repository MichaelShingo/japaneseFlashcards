import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
  value: GlobalState;
};

export type SnackbarData = {
  isOpen: boolean;
  message: string;
};


type GlobalState = {
  snackBarData: SnackbarData;
};

const initialState = {
  value: {
    snackBarData: { isOpen: false, message: '' },
  } as GlobalState,
} as InitialState;

export const global = createSlice({
  name: 'global',
  initialState: initialState,
  reducers: {
    setSnackBarData: (state, action: PayloadAction<SnackbarData>) => {
      state.value.snackBarData = action.payload;
    },

  }
});

export const {
  setSnackBarData,
} = global.actions;
export default global.reducer;
