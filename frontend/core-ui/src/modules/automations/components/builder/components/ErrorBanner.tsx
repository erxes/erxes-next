import { IconAlertTriangle, IconX, IconRefresh } from '@tabler/icons-react';
import { Button } from 'erxes-ui';
import { useState } from 'react';
import { cn } from 'erxes-ui';

interface ErrorBannerProps {
  errors: Array<{
    nodeId: string;
    nodeLabel: string;
    error: string;
  }>;
  onClearAllErrors?: () => void;
  onFocusError?: (nodeId: string) => void;
  className?: string;
}

export const ErrorBanner = ({
  errors,
  onClearAllErrors,
  onFocusError,
  className,
}: ErrorBannerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (errors.length === 0) {
    return null;
  }

  const errorCount = errors.length;
  const firstError = errors[0];

  return (
    <div className={cn('fixed bottom-4 right-4 z-50 max-w-md', className)}>
      <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-red-200">
          <div className="flex items-center gap-2">
            <IconAlertTriangle className="size-5 text-red-600" />
            <div>
              <h4 className="font-semibold text-red-800">
                {errorCount === 1
                  ? 'Configuration Error'
                  : `${errorCount} Configuration Errors`}
              </h4>
              <p className="text-xs text-red-600">
                {errorCount === 1
                  ? `Error in "${firstError.nodeLabel}"`
                  : `Errors found in ${errorCount} nodes`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {errorCount > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-red-200"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? '−' : '+'}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-red-200"
              onClick={onClearAllErrors}
            >
              <IconX className="size-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          {errorCount === 1 ? (
            <div>
              <p className="text-sm text-red-700 mb-2">{firstError.error}</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs border-red-300 text-red-700 hover:bg-red-100"
                  onClick={() => onFocusError?.(firstError.nodeId)}
                >
                  <IconRefresh className="size-3 mr-1" />
                  Focus Node
                </Button>
              </div>
            </div>
          ) : (
            <div>
              {!isExpanded ? (
                <div>
                  <p className="text-sm text-red-700 mb-2">
                    Multiple nodes have configuration errors. Click + to see
                    details.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs border-red-300 text-red-700 hover:bg-red-100"
                    onClick={() => onFocusError?.(firstError.nodeId)}
                  >
                    <IconRefresh className="size-3 mr-1" />
                    Focus First Error
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {errors.map((error, index) => (
                    <div
                      key={error.nodeId}
                      className="p-2 bg-red-100 rounded border border-red-200"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-xs font-medium text-red-800">
                            {index + 1}. {error.nodeLabel}
                          </p>
                          <p className="text-xs text-red-700 mt-1">
                            {error.error}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-red-200"
                          onClick={() => onFocusError?.(error.nodeId)}
                        >
                          <IconRefresh className="size-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
