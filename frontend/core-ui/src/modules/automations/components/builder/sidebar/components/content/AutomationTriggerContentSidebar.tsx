import {
  getCoreAutomationTriggerComponent,
  isCoreAutomationTriggerType,
  TAutomationTriggerComponent,
} from '@/automations/components/builder/nodes/triggers/coreAutomationTriggers';
import { useCustomTriggerContent } from '@/automations/components/builder/sidebar/hooks/useCustomTriggerContent';
import { useDefaultTriggerContent } from '@/automations/components/builder/sidebar/hooks/useDefaultTriggerContent';
import { NodeData } from '@/automations/types';
import { RenderPluginsComponentWrapper } from '@/automations/components/common/RenderPluginsComponentWrapper';
import { IconSettings } from '@tabler/icons-react';
import { Button, toast } from 'erxes-ui';
import React, { useCallback, useMemo, useRef, Suspense } from 'react';
import { SegmentForm } from 'ui-modules';
import { useSetAtom } from 'jotai';
import { toggleAutomationBuilderOpenSidebar } from '@/automations/states/automationState';
import { useAutomation } from '@/automations/context/AutomationProvider';
import { useFormContext } from 'react-hook-form';
import { TAutomationBuilderForm } from '@/automations/utils/automationFormDefinitions';

/**
 * Props for automation trigger content components
 */
interface AutomationTriggerContentProps {
  /** The active automation node data */
  activeNode: NodeData;
}

/**
 * Props for the trigger content wrapper component
 */
interface TriggerContentWrapperProps {
  /** Content to render in the main area */
  children: React.ReactNode;
  /** Footer content with actions */
  footer: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Accessibility label for the wrapper */
  'aria-label'?: string;
}

/**
 * Loading fallback component for async content
 */
const TriggerContentLoadingFallback = React.memo(() => (
  <div
    className="flex items-center justify-center h-32"
    role="status"
    aria-label="Loading trigger configuration"
  >
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <span className="sr-only">Loading...</span>
  </div>
));

TriggerContentLoadingFallback.displayName = 'TriggerContentLoadingFallback';

/**
 * Error boundary fallback component
 */
const TriggerContentErrorFallback = React.memo(
  ({ error, onRetry }: { error: Error; onRetry: () => void }) => (
    <div
      className="flex flex-col items-center justify-center h-32 p-4 text-center"
      role="alert"
      aria-live="polite"
    >
      <div className="text-destructive mb-2">
        <svg
          className="w-6 h-6 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        Failed to load trigger configuration
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        aria-label="Retry loading trigger configuration"
      >
        Try Again
      </Button>
    </div>
  ),
);

TriggerContentErrorFallback.displayName = 'TriggerContentErrorFallback';

/**
 * Reusable wrapper component for trigger content with consistent layout
 */
const TriggerContentWrapper = React.memo<TriggerContentWrapperProps>(
  ({ children, footer, className = '', 'aria-label': ariaLabel, ...props }) => {
    const wrapperClasses = useMemo(
      () => `flex flex-col h-full ${className}`.trim(),
      [className],
    );

    return (
      <div
        className={wrapperClasses}
        aria-label={ariaLabel}
        role="region"
        {...props}
      >
        <div className="flex-1 w-auto overflow-auto">{children}</div>
        <footer className="p-3 flex justify-end border-t bg-background/50 backdrop-blur-sm">
          {footer}
        </footer>
      </div>
    );
  },
);

TriggerContentWrapper.displayName = 'TriggerContentWrapper';

/**
 * Default trigger content component for standard automation triggers
 */
const DefaultTriggerContent = React.memo<AutomationTriggerContentProps>(
  ({ activeNode }) => {
    const { contentId, handleCallback } = useDefaultTriggerContent({
      activeNode,
    });

    const handleFormCallback = useCallback(
      (data: unknown) => {
        try {
          handleCallback(data as string);
        } catch (error) {
          console.error('Error in trigger form callback:', error);
        }
      },
      [handleCallback],
    );

    return (
      <Suspense fallback={<TriggerContentLoadingFallback />}>
        <SegmentForm
          contentType={activeNode?.type || ''}
          segmentId={contentId}
          callback={handleFormCallback}
          isTemporary
          aria-label={`Configure ${activeNode?.type || 'trigger'} settings`}
        />
      </Suspense>
    );
  },
);

DefaultTriggerContent.displayName = 'DefaultTriggerContent';

/**
 * Custom remote trigger content component for plugin-based triggers
 */
const CustomRemoteTriggerContent = React.memo<AutomationTriggerContentProps>(
  ({ activeNode }) => {
    const formRef = useRef<{ submit: () => void }>(null);

    const { pluginName, moduleName, activeTrigger, onSaveTriggerConfig } =
      useCustomTriggerContent(activeNode);

    const handleSave = useCallback(() => {
      try {
        formRef.current?.submit();
      } catch (error) {
        console.error('Error submitting trigger form:', error);
      }
    }, []);

    const footerContent = useMemo(
      () => (
        <Button
          onClick={handleSave}
          aria-label={`Save ${activeNode?.type || 'trigger'} configuration`}
        >
          Save Configuration
        </Button>
      ),
      [handleSave, activeNode?.type],
    );

    const pluginProps = useMemo(
      () => ({
        formRef,
        componentType: 'triggerForm' as const,
        activeTrigger,
        onSaveTriggerConfig,
      }),
      [activeTrigger, onSaveTriggerConfig],
    );

    return (
      <TriggerContentWrapper
        footer={footerContent}
        aria-label={`Configure ${pluginName} ${moduleName} trigger`}
      >
        <Suspense fallback={<TriggerContentLoadingFallback />}>
          <RenderPluginsComponentWrapper
            pluginName={pluginName}
            moduleName={moduleName}
            props={pluginProps}
          />
        </Suspense>
      </TriggerContentWrapper>
    );
  },
);

CustomRemoteTriggerContent.displayName = 'CustomRemoteTriggerContent';

/**
 * Custom core trigger content component for built-in core triggers
 */
const CustomCoreTriggerContent = React.memo<
  { moduleName: string } & AutomationTriggerContentProps
>(({ activeNode, moduleName }) => {
  const formRef = useRef<{ submit: () => void }>(null);
  const toggleSideBarOpen = useSetAtom(toggleAutomationBuilderOpenSidebar);
  const { setQueryParams } = useAutomation();
  const { setValue } = useFormContext<TAutomationBuilderForm>();

  const handleSave = useCallback(
    (config: any) => {
      // TODO: Implement core trigger configuration save logic
      console.log('Saving core trigger configuration for:', activeNode?.type);
      setValue(`triggers.${activeNode.nodeIndex}.config`, config);
      setQueryParams({ activeNodeId: null });
      toggleSideBarOpen();
      toast({
        title: 'Action configuration added successfully.',
      });
    },
    [activeNode?.type],
  );

  const Component = getCoreAutomationTriggerComponent(
    moduleName as any,
    TAutomationTriggerComponent.Sidebar,
  );

  const footerContent = useMemo(
    () => (
      <Button
        onClick={() => {
          formRef.current?.submit();
          console.log('fasdnskja');
        }}
        aria-label={`Save ${activeNode?.type || 'core trigger'} configuration`}
      >
        Save Configuration
      </Button>
    ),
    [handleSave, activeNode?.type],
  );

  const updatedProps = { formRef, activeNode, handleSave };

  return (
    <TriggerContentWrapper
      footer={footerContent}
      aria-label={`Configure ${activeNode?.type || 'core trigger'} settings`}
    >
      {Component && <Component {...updatedProps} />}
    </TriggerContentWrapper>
  );
});

CustomCoreTriggerContent.displayName = 'CustomCoreTriggerContent';

/**
 * Custom trigger content router component
 */
const CustomTriggerContent = React.memo<AutomationTriggerContentProps>(
  ({ activeNode }) => {
    const { moduleName } = useCustomTriggerContent(activeNode);

    const isCoreTrigger = useMemo(
      () =>
        isCoreAutomationTriggerType(
          moduleName as any,
          TAutomationTriggerComponent.Sidebar,
        ),
      [moduleName],
    );

    if (isCoreTrigger) {
      return (
        <CustomCoreTriggerContent
          moduleName={moduleName}
          activeNode={activeNode}
        />
      );
    }

    return <CustomRemoteTriggerContent activeNode={activeNode} />;
  },
);

CustomTriggerContent.displayName = 'CustomTriggerContent';

/**
 * Main automation trigger content sidebar component
 *
 * Renders the appropriate trigger configuration interface based on the active node type.
 * Supports both default triggers and custom plugin-based triggers with proper error handling
 * and accessibility features.
 */
export const AutomationTriggerContentSidebar =
  React.memo<AutomationTriggerContentProps>(({ activeNode }) => {
    const containerClasses = useMemo(() => 'w-[650px] h-full', []);

    if (activeNode?.isCustom) {
      return (
        <div className={containerClasses}>
          <CustomTriggerContent activeNode={activeNode} />
        </div>
      );
    }

    return (
      <div className={containerClasses}>
        <DefaultTriggerContent activeNode={activeNode} />
      </div>
    );
  });

AutomationTriggerContentSidebar.displayName = 'AutomationTriggerContentSidebar';
