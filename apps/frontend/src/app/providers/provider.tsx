"use client";

import * as React from "react";
import { HeroUIProvider } from "@heroui/react";
import { Toaster } from "sonner";
import NProgress from "nprogress";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store";
import { useDispatch } from "react-redux";
import { validateSession } from "@/redux/slices/authSlice";
import { AppDispatch } from "@/redux/store";

// Configure NProgress
NProgress.configure({
  minimum: 0.3,
  easing: "ease",
  speed: 500,
  showSpinner: false,
});

const PUBLIC_PATHS = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/legal/terms",
  "/legal/privacy",
];

const SessionValidator = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const isValidatingRef = React.useRef(false);

  React.useEffect(() => {
    const validateUserSession = async () => {
      // Skip validation for public paths
      if (
        isValidatingRef.current ||
        PUBLIC_PATHS.some(
          (path) => pathname === path || pathname.startsWith("/auth/")
        )
      ) {
        return;
      }

      try {
        isValidatingRef.current = true;
        await dispatch(validateSession()).unwrap();
      } catch {
        // If validation fails, let the interceptor handle the refresh
        // The interceptor will handle redirects if needed
        return;
      } finally {
        isValidatingRef.current = false;
      }
    };

    validateUserSession();
  }, [dispatch, router, pathname]);

  return <>{children}</>;
};

const Provider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    NProgress.start();

    // Use requestAnimationFrame to ensure the progress bar shows up
    const timer = requestAnimationFrame(() => {
      NProgress.done();
    });

    return () => {
      cancelAnimationFrame(timer);
      NProgress.done();
    };
  }, [pathname, searchParams]);

  return (
    <ReduxProvider store={store}>
      <HeroUIProvider>
        <SessionValidator>
          <Toaster
            position="bottom-right"
            theme="dark"
            closeButton
            richColors
            toastOptions={{
              style: {
                background: "#1E1E1E",
                border: "1px solid #2D2D2D",
                color: "#fff",
              },
            }}
          />
          {children}
        </SessionValidator>
      </HeroUIProvider>
    </ReduxProvider>
  );
};

export default Provider;
