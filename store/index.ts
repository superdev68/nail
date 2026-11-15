import { configureStore } from "@reduxjs/toolkit";
import bookingReducer from "./booking-slice";
import settingBoxReducer from "./settingBox-slice";

const store = configureStore({
  reducer: {
    booking: bookingReducer,
    settingBox: settingBoxReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
