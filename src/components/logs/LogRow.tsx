import { MaterialIcon } from "@/components/ui/MaterialIcon";

export interface LogEntry {
  id: string;
  timestamp: string;
  source: string;
  action: string;
  status: "completed" | "success" | "failed";
  duration: string;
}

const STATUS_STYLE: Record<string, string> = {
  completed: "text-tertiary",
  success: "text-tertiary",
  failed: "text-error",
};

interface LogRowProps {
  entry: LogEntry;
}

export function LogRow({ entry }: LogRowProps) {
  return (
    <tr className="border-b border-outline-variant/10 hover:bg-surface-container/50 transition-colors">
      <td className="py-3 px-4 text-xs font-mono text-primary">{entry.id}</td>
      <td className="py-3 px-4 text-xs text-on-surface-variant font-mono">
        {entry.timestamp}
      </td>
      <td className="py-3 px-4 text-xs font-medium text-on-surface">
        {entry.source}
      </td>
      <td className="py-3 px-4 text-xs text-on-surface-variant">
        {entry.action}
      </td>
      <td className="py-3 px-4">
        <span
          className={`text-xs font-bold uppercase ${STATUS_STYLE[entry.status]}`}
        >
          {entry.status}
        </span>
      </td>
      <td className="py-3 px-4 text-xs text-on-surface-variant font-mono">
        {entry.duration}
      </td>
      <td className="py-3 px-4">
        <button className="text-slate-500 hover:text-primary transition-colors">
          <MaterialIcon icon="open_in_new" size="xs" />
        </button>
      </td>
    </tr>
  );
}
