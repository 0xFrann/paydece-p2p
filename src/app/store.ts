import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import ownLocationReducer from "../features/ownLocation/ownLocationSlice";
import { pointsAPI } from "../services/points";

export const store = configureStore({
  reducer: {
    [pointsAPI.reducerPath]: pointsAPI.reducer,
    ownLocation: ownLocationReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pointsAPI.middleware)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
