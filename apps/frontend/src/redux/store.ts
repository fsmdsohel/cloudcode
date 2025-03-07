import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import workspaceReducer from "./slices/workspaceSlice";
import { setupInterceptors } from "./api/interceptors";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workspace: workspaceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["auth/login/fulfilled", "auth/refreshToken/fulfilled"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["payload.timestamp"],
        // Ignore these paths in the state
        ignoredPaths: ["auth.user.createdAt", "auth.user.updatedAt"],
      },
    }),
});

// Setup API interceptors
setupInterceptors(store);

// Use ReturnType to infer the RootState from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
