"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";

interface HookBreakdown {
  name: string;
  pass: number;
  fail: number;
}

interface HookBreakdownChartProps {
  data: HookBreakdown[];
}

export function HookBreakdownChart({ data }: HookBreakdownChartProps) {
  return (
    <GlassCard className="p-6">
      <h3 className="font-headline text-sm font-bold text-on-surface mb-4">
        훅별 통과/실패 비율
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "#6f7588", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6f7588", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#12192b",
                border: "1px solid #424859",
                borderRadius: "8px",
                color: "#e0e5fb",
                fontSize: "12px",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", color: "#a5aabf" }}
            />
            <Bar dataKey="pass" name="통과" fill="#9bffce" radius={[2, 2, 0, 0]} />
            <Bar dataKey="fail" name="실패" fill="#ff716c" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
