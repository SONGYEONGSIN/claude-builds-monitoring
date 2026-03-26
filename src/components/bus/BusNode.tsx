import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface BusNodeProps {
  icon: string;
  label: string;
  color: "primary" | "secondary" | "tertiary";
  active?: boolean;
}

const BORDER_COLOR = {
  primary: "border-primary/40",
  secondary: "border-secondary/40",
  tertiary: "border-tertiary/40",
};

const TEXT_COLOR = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
};

export function BusNode({ icon, label, color, active }: BusNodeProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`w-16 h-16 rounded-2xl bg-surface-container border-2 ${BORDER_COLOR[color]} flex items-center justify-center ${active ? "glow-primary" : ""}`}
      >
        <MaterialIcon icon={icon} size="xl" className={TEXT_COLOR[color]} />
      </div>
      <span className="text-xs font-bold text-slate-400">{label}</span>
    </div>
  );
}
