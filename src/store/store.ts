import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import packageReducer from "./slices/packageSlice";
import transactionReducer from "./slices/transactionSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    packages: packageReducer,
    transactions: transactionReducer,
    users: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
