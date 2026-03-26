"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { LogRow } from "./LogRow";
import { LogSearch } from "./LogSearch";
import type { LogEntry } from "./LogRow";

interface LogTableProps {
  entries: LogEntry[];
}

export function LogTable({ entries }: LogTableProps) {
  const [filter, setFilter] = useState("");

  const filtered = filter
    ? entries.filter(
        (e) =>
          e.source.toLowerCase().includes(filter.toLowerCase()) ||
          e.action.toLowerCase().includes(filter.toLowerCase()) ||
          e.id.toLowerCase().includes(filter.toLowerCase())
      )
    : entries;

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-headline text-2xl font-bold text-on-surface">
          이력 로그
        </h2>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="p-4 border-b border-outline-variant/10">
          <LogSearch onSearch={setFilter} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/10">
                <th className="text-left py-3 px-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  ID
                </th>
                <th className="text-left py-3 px-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  타임스탬프
                </th>
                <th className="text-left py-3 px-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  소스
                </th>
                <th className="text-left py-3 px-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  작업
                </th>
                <th className="text-left py-3 px-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  상태
                </th>
                <th className="text-left py-3 px-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  소요시간
                </th>
                <th className="text-left py-3 px-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  상세
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <LogRow key={entry.id} entry={entry} />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-sm text-slate-500"
                  >
                    로그 데이터가 없습니다
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </section>
  );
}
