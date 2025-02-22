import { api } from "../slices/authSlice";
import { clearAuth, logout } from "../slices/authSlice";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

export const setupInterceptors = (store: any) => {
  // Add request interceptor to log headers
  api.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      console.log("[Interceptor] Error:", {
        url: originalRequest.url,
        status: error.response?.status,
        isRefreshing,
      });

      // Don't retry if it's a logout request
      if (originalRequest.url === "/api/v1/auth/logout") {
        store.dispatch(clearAuth());
        return Promise.reject(error);
      }

      // Handle 401 errors
      if (error.response?.status === 401 && !originalRequest._retry) {
        // Don't retry refresh token requests
        if (originalRequest.url === "/api/v1/auth/refresh") {
          // Properly logout and clear everything
          await store.dispatch(logout()).unwrap();
          if (typeof window !== "undefined") {
            window.location.href = "/auth/login";
          }
          return Promise.reject(error);
        }

        // Mark as retried
        originalRequest._retry = true;

        if (isRefreshing) {
          try {
            await new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            });
            return api(originalRequest);
          } catch (err) {
            return Promise.reject(err);
          }
        }

        isRefreshing = true;

        try {
          // Try to refresh the token
          await api.post("/api/v1/auth/refresh");
          processQueue();
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);
          // Properly logout and clear everything
          await store.dispatch(logout()).unwrap();
          if (
            typeof window !== "undefined" &&
            !originalRequest.url.includes("/validate")
          ) {
            window.location.href = "/auth/login";
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};
