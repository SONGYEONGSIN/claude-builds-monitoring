"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface LogSearchProps {
  onSearch: (query: string) => void;
}

export function LogSearch({ onSearch }: LogSearchProps) {
  const [query, setQuery] = useState("");

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 relative">
        <MaterialIcon
          icon="search"
          size="sm"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          type="text"
          placeholder="로그 검색..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch(e.target.value);
          }}
          className="w-full pl-10 pr-4 py-2.5 bg-surface-container border-b border-outline-variant/20 text-sm text-on-surface placeholder-slate-500 focus:border-primary focus:shadow-[0_0_4px_rgba(58,223,250,0.3)] outline-none transition-all rounded-none"
        />
      </div>
      <button className="px-4 py-2.5 bg-surface-container-high text-xs text-on-surface-variant font-medium hover:bg-surface-bright transition-colors rounded-sm">
        필터
      </button>
    </div>
  );
}
