import { FallbackProps } from 'react-error-boundary';

type GenericErrorFallbackProps = FallbackProps & {
  title?: string;
};

export const GenericErrorFallback = ({
  resetErrorBoundary,
  error,
  title = 'Sorry, something went wrong',
}: GenericErrorFallbackProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mb-6 text-gray-600">{error?.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};
