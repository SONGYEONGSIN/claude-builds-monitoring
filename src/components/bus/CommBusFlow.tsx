import { GlassCard } from "@/components/ui/GlassCard";
import { BusNode } from "./BusNode";

interface FlowConnection {
  label: string;
  color: string;
}

interface CommBusFlowProps {
  connections?: FlowConnection[];
}

function FlowLine({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex-1 px-4 relative h-10">
      <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
        <path
          d="M0 10 Q 50 20 100 10"
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity="0.2"
        />
        <path
          d="M0 10 Q 50 20 100 10"
          fill="none"
          stroke={color}
          strokeWidth="2"
          className="data-flow-path"
        />
      </svg>
      <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 bg-surface-container px-2 py-0.5 rounded-sm text-[8px] border border-outline-variant/30 text-slate-500 whitespace-nowrap">
        {label}
      </div>
    </div>
  );
}

export function CommBusFlow({ connections }: CommBusFlowProps) {
  const flows = connections ?? [
    { label: "SCHEMA_DATA.JSON", color: "#3adffa" },
    { label: "UI_ASSET_PACK.ZIP", color: "#699cff" },
  ];

  return (
    <section className="mb-12">
      <h2 className="font-headline text-xl font-bold text-on-surface mb-6">
        통신 버스
      </h2>
      <GlassCard className="p-12 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
        </div>
        <div className="flex justify-between items-center relative z-10 max-w-4xl mx-auto">
          <BusNode icon="architecture" label="PLANNER" color="primary" active />
          <FlowLine label={flows[0].label} color={flows[0].color} />
          <BusNode icon="palette" label="DESIGNER" color="secondary" />
          <FlowLine label={flows[1].label} color={flows[1].color} />
          <BusNode icon="code" label="DEVELOPER" color="tertiary" />
        </div>
      </GlassCard>
    </section>
  );
}
