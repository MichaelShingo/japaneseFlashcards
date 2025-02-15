import { ConfirmModalProps } from '@/app/components/molecules/Modals/ConfirmModal';
import { DeckUpsertModalProps } from '@/app/components/molecules/Modals/DeckUpsertModal';
import { ModalKeys, ModalPropsAll } from '@/app/components/molecules/Modals/ModalHandler';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
  value: GlobalState;
};

export type SnackbarData = {
  isOpen: boolean;
  message: string;
};


export type ModalData = {
  modalType: ModalKeys;
  props: ModalPropsAll;
};


type GlobalState = {
  snackBarData: SnackbarData;
  modalData: ModalData | null;
};

const initialState = {
  value: {
    snackBarData: { isOpen: false, message: '' },
    modalData: null,
  } as GlobalState,
} as InitialState;

export const global = createSlice({
  name: 'global',
  initialState: initialState,
  reducers: {
    setSnackBarData: (state, action: PayloadAction<SnackbarData>) => {
      state.value.snackBarData = action.payload;
    },
    setModalData: (state, action: PayloadAction<ModalData>) => {
      state.value.modalData = action.payload;
    }
  }
});

export const {
  setSnackBarData,
  setModalData,
} = global.actions;
export default global.reducer;
