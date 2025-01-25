import { configureStore } from '@reduxjs/toolkit';
import locationReducer from './features/locationSlice';
import windowReducer from './features/windowSlice';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

export const store = configureStore({
	reducer: { locationReducer, windowReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
