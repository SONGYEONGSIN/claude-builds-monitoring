"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";

interface TrendPoint {
  date: string;
  successRate: number;
  totalEvents: number;
}

interface SuccessRateChartProps {
  data: TrendPoint[];
}

export function SuccessRateChart({ data }: SuccessRateChartProps) {
  return (
    <GlassCard className="p-6">
      <h3 className="font-headline text-sm font-bold text-on-surface mb-4">
        빌드 성공률 추이
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3adffa" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3adffa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "#6f7588", fontSize: 10 }}
              tickFormatter={(v) => v.slice(5)}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6f7588", fontSize: 10 }}
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                background: "#12192b",
                border: "1px solid #424859",
                borderRadius: "8px",
                color: "#e0e5fb",
                fontSize: "12px",
              }}
              formatter={(value) => [`${value}%`, "성공률"]}
              labelFormatter={(label) => `날짜: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="successRate"
              stroke="#3adffa"
              strokeWidth={2}
              fill="url(#successGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
