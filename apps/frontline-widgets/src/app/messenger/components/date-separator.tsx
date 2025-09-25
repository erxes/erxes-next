export function DateSeparator({ date }: { date: string }) {
  return (
    <div className="relative flex items-center justify-center my-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200"></div>
      </div>
      <div className="relative bg-zinc-50 px-3">
        <span className="text-sm text-gray-500 font-medium">{date}</span>
      </div>
    </div>
  );
}
