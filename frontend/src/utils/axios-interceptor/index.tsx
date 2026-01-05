import React, { useEffect, useState } from "react";
import Axios, { AxiosError, AxiosRequestHeaders } from "axios";
import { IAxiosInterceptor, IErrorResponse } from "./interfaces";
import Loader from "./loader";
import toast, { Toaster } from "react-hot-toast";

const process = import.meta.env;

let jwtToken: string = "";

export const setDefaultAxiosConfig = (
  baseURL?: string,
  headers?: AxiosRequestHeaders | Record<string, string>,
  timeout?: number
): void => {
  if (baseURL) Axios.defaults.baseURL = baseURL;
  if (headers) {
    Axios.defaults.headers.common = {
      ...Axios.defaults.headers.common,
      ...headers,
    };
  }
  if (timeout) Axios.defaults.timeout = timeout;
};

export const setToken = (token: string): void => {
  jwtToken = token;
};

export const errorToast = (message: string) => {
  return toast.custom((t) => (
    <div
      role="alert"
      aria-live="assertive"
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-red-500/30`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-gray-900">
              Error Occurred
            </h3>
            <p className="mt-1 text-sm text-gray-600">{message}</p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200/50">
        <button
          type="button"
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          aria-label="Close error message"
        >
          Dismiss
        </button>
      </div>
    </div>
  ));
};

const AxiosInterceptor: React.FC<IAxiosInterceptor> = ({
  config,
  loaderComponent,
}) => {
  const { BASE_URL, HEADERS, TIMEOUT } = config || {};
  const [loading, setLoading] = useState(false);
  const [activeRequests, setActiveRequests] = useState(0);

  // Helper: Should show loader for this request?
  const shouldShowLoader = (url: string | undefined): boolean => {
    if (!url) return true;
    return !url.includes("/order/check");
  };

  useEffect(() => {
    if (BASE_URL ?? process?.VITE_BASE_URL) {
      setDefaultAxiosConfig(
        BASE_URL ?? process?.VITE_BASE_URL,
        HEADERS ?? process?.HEADERS,
        TIMEOUT ?? process?.TIMEOUT
      );
    }
  }, [BASE_URL, HEADERS, TIMEOUT]);

  useEffect(() => {
    const requestInterceptor = Axios.interceptors.request.use((request) => {
      const showLoader = shouldShowLoader(request.url);
      if (showLoader) {
        setActiveRequests((prev) => prev + 1);
        setLoading(true);
      }
      // Ensure headers exist
      if (!request.headers) {
        request.headers = {} as AxiosRequestHeaders;
      }
      // Add X-COMPANY header to every request
      request.headers["X-COMPANY"] = process.VITE_COMPANY;

      if (jwtToken && window.location.pathname.startsWith("/admin")) {
        request.headers = {
          ...request.headers,
          Authorization: `Bearer ${jwtToken}`,
        } as AxiosRequestHeaders;
      } else if (request.headers) {
        delete request.headers.Authorization;
      }

      return request;
    });

    const responseInterceptor = Axios.interceptors.response.use(
      (response) => {
        if (shouldShowLoader(response.config.url)) {
          setActiveRequests((prev) => Math.max(prev - 1, 0));
        }
        return response;
      },
      (error: unknown) => {
        if (Axios.isAxiosError(error) && shouldShowLoader(error.config?.url)) {
          setActiveRequests((prev) => Math.max(prev - 1, 0));
        }

        // Handle canceled requests
        if (Axios.isCancel(error)) {
          return Promise.reject(error);
        }

        // Handle Axios errors
        if (Axios.isAxiosError<IErrorResponse>(error)) {
          if (
            error.response?.status === 401 &&
            window.location.pathname.startsWith("/admin")
          ) {
            window.location.href = "/admin";
            sessionStorage.clear();
            return Promise.reject(error);
          }

          const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Something went wrong.";

          errorToast(message);
        } else if (error instanceof Error) {
          errorToast(error.message || "An unexpected error occurred");
        } else if (typeof error === "string") {
          errorToast(error);
        } else {
          errorToast("An unknown error occurred");
        }

        return Promise.reject(error);
      }
    );

    return () => {
      Axios.interceptors.request.eject(requestInterceptor);
      Axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  useEffect(() => {
    setLoading(activeRequests > 0);
  }, [activeRequests]);

  return (
    <>
      {loading && (loaderComponent ?? <Loader />)}
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          duration: 2000,
          removeDelay: 200,
        }}
      />
    </>
  );
};

export default React.memo(AxiosInterceptor);
