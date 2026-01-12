import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/lib/storage/session";
import persistedSlice from "./slices/persistedSlice";
import fundSliceReducer from "./slices/fundSlice";
import transactionReducer from "./slices/transactionSlice";

const persistedSliceConfig = {
  key: "user",
  storage: sessionStorage,
};

const persistedSliceReducer = persistReducer(
  persistedSliceConfig,
  persistedSlice
);

const rootReducer = combineReducers({
  persistedSlice: persistedSliceReducer,
  fundSlice: fundSliceReducer,
  transactionSlice: transactionReducer
});

// Create store with persisted reducer
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
