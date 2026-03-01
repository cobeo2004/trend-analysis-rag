"use client";
import { useHello } from "@/hooks/useHello";

export function HelloComponent() {
  const { data, isLoading, isError } = useHello();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
        <div className="flex items-start gap-3">
          <svg
            aria-hidden="true"
            className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 13a1 1 0 011-1h6a1 1 0 110 2H5a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h3 className="text-sm font-semibold text-red-900 dark:text-red-200">
              Error loading message
            </h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              Something went wrong. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-8 shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:to-black">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-100">
          <svg
            aria-hidden="true"
            className="h-6 w-6 text-white dark:text-zinc-900"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 13a1 1 0 011-1h6a1 1 0 110 2H5a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Message
          </h2>
          <p className="mt-2 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
            {data?.message}
          </p>
        </div>
      </div>
    </div>
  );
}
