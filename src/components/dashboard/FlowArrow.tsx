export function FlowArrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center py-3">
      <div className="w-0.5 h-6 bg-gradient-to-b from-primary/40 to-primary" />
      {label && (
        <span className="text-[10px] text-slate-500 my-1">{label}</span>
      )}
      <span className="text-primary text-sm">▼</span>
    </div>
  );
}
