export function BotSeparator({ content }: { content: string }) {
  return (
    <div className="relative flex items-center justify-center my-3">
      <div className="relative bg-sidebar px-3 py-1">
        <span className="text-xs text-accent-foreground font-medium">
          {content}
        </span>
      </div>
    </div>
  );
}
