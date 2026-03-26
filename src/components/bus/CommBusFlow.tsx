"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { AGENTS } from "@/lib/constants/agents";
import type { AgentMessage } from "@/types/message";

interface CommBusFlowProps {
  messages: AgentMessage[];
}

const TYPE_STYLES: Record<string, string> = {
  alert: "bg-error/10 text-error border-error/20",
  request: "bg-primary/10 text-primary border-primary/20",
  reply: "bg-tertiary/10 text-tertiary border-tertiary/20",
  info: "bg-secondary/10 text-secondary border-secondary/20",
  "debate-invite": "bg-warning/10 text-warning border-warning/20",
  "debate-round": "bg-secondary/10 text-secondary border-secondary/20",
  "debate-verdict": "bg-tertiary/10 text-tertiary border-tertiary/20",
};

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "방금";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

export function CommBusFlow({ messages }: CommBusFlowProps) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const activeAgents = new Set<string>();
  const connections: { from: string; to: string; count: number; key: string }[] = [];
  const connMap: Record<string, number> = {};

  for (const msg of messages) {
    activeAgents.add(msg.from);
    activeAgents.add(msg.to);
    const key = `${msg.from}→${msg.to}`;
    connMap[key] = (connMap[key] ?? 0) + 1;
  }

  for (const [key, count] of Object.entries(connMap)) {
    const [from, to] = key.split("→");
    connections.push({ from, to, count, key });
  }

  const allAgents = AGENTS.map((a) => a.name);
  const radius = 170;
  const cx = 220;
  const cy = 220;
  const svgSize = 440;

  const positions = allAgents.map((name, i) => {
    const angle = (i / allAgents.length) * Math.PI * 2 - Math.PI / 2;
    return {
      name,
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      active: activeAgents.has(name),
    };
  });

  const posMap: Record<string, { x: number; y: number }> = {};
  for (const p of positions) {
    posMap[p.name] = { x: p.x, y: p.y };
  }

  const filteredMessages = selectedAgent
    ? messages.filter((m) => m.from === selectedAgent || m.to === selectedAgent)
    : messages;

  function isRelated(name: string) {
    if (!selectedAgent) return true;
    if (name === selectedAgent) return true;
    return messages.some(
      (m) => (m.from === selectedAgent && m.to === name) || (m.to === selectedAgent && m.from === name)
    );
  }

  function isConnHighlighted(from: string, to: string) {
    if (!selectedAgent) return false;
    return from === selectedAgent || to === selectedAgent;
  }

  return (
    <>
      <h2 className="font-headline text-xl font-bold text-on-surface mb-6">통신 버스</h2>

      {/* ── 네트워크 그래프 ── */}
      <GlassCard className="p-8 mb-6">
        <div className="flex justify-center mb-6">
          <div className="relative" style={{ width: svgSize, height: svgSize }}>
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(58,223,250,0.06)_0%,transparent_60%)]" />
            </div>

            <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="w-full h-full">
              <defs>
                <filter id="glow-strong">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-soft">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3adffa" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#699cff" stopOpacity="0.9" />
                </linearGradient>
                <radialGradient id="particleGrad">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="40%" stopColor="#3adffa" />
                  <stop offset="100%" stopColor="#3adffa" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* 가이드 원 */}
              <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 6" opacity="0.3" />

              {/* ── 연결선 ── */}
              {connections.map((conn) => {
                const p1 = posMap[conn.from];
                const p2 = posMap[conn.to];
                if (!p1 || !p2) return null;

                const highlighted = isConnHighlighted(conn.from, conn.to);
                const dimmed = selectedAgent && !highlighted;
                const pathId = `path-${conn.key.replace("→", "-")}`;

                // 곡선: 중심점 기준으로 약간 바깥으로 휘어짐
                const mx = (p1.x + p2.x) / 2;
                const my = (p1.y + p2.y) / 2;
                const dx = mx - cx;
                const dy = my - cy;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                const curve = 25;
                const cpx = mx + (dx / dist) * curve;
                const cpy = my + (dy / dist) * curve;

                return (
                  <g key={conn.key}>
                    {/* 경로 정의 (파티클용) */}
                    <path
                      id={pathId}
                      d={`M${p1.x},${p1.y} Q${cpx},${cpy} ${p2.x},${p2.y}`}
                      fill="none"
                      stroke="none"
                    />

                    {/* 배경 선 */}
                    <path
                      d={`M${p1.x},${p1.y} Q${cpx},${cpy} ${p2.x},${p2.y}`}
                      fill="none"
                      stroke={highlighted ? "#3adffa" : "#3adffa"}
                      strokeWidth={dimmed ? 1 : Math.min(conn.count + 1, 4)}
                      opacity={dimmed ? 0.05 : 0.1}
                    />

                    {/* 메인 선 */}
                    <path
                      d={`M${p1.x},${p1.y} Q${cpx},${cpy} ${p2.x},${p2.y}`}
                      fill="none"
                      stroke="url(#lineGrad)"
                      strokeWidth={dimmed ? 0.5 : Math.min(conn.count + 1, 4)}
                      opacity={dimmed ? 0.08 : 0.5}
                      className="data-flow-path"
                      filter={highlighted ? "url(#glow-strong)" : undefined}
                      style={highlighted ? {
                        animation: "line-glow-pulse 1.5s ease-in-out infinite",
                      } : undefined}
                    />

                    {/* 하이라이트 시 파티클들 */}
                    {highlighted && [0, 1, 2].map((i) => (
                      <circle key={i} r="4" fill="url(#particleGrad)" filter="url(#glow-soft)">
                        <animateMotion
                          dur={`${1.5 + i * 0.5}s`}
                          repeatCount="indefinite"
                          begin={`${i * 0.5}s`}
                        >
                          <mpath href={`#${pathId}`} />
                        </animateMotion>
                        <animate attributeName="r" values="2;5;2" dur={`${1.5 + i * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
                        <animate attributeName="opacity" values="0;1;0" dur={`${1.5 + i * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
                      </circle>
                    ))}

                    {/* 비하이라이트 시 단일 파티클 */}
                    {!dimmed && !highlighted && (
                      <circle r="2" fill="#3adffa" opacity="0.5">
                        <animateMotion dur="4s" repeatCount="indefinite">
                          <mpath href={`#${pathId}`} />
                        </animateMotion>
                      </circle>
                    )}

                    {/* 메시지 수 */}
                    {!dimmed && (
                      <text
                        x={cpx} y={cpy - 10}
                        textAnchor="middle"
                        fill={highlighted ? "#ffffff" : "#3adffa"}
                        fontSize={highlighted ? "11" : "9"}
                        fontFamily="monospace"
                        fontWeight="bold"
                        filter={highlighted ? "url(#glow-soft)" : undefined}
                      >
                        {conn.count}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* ── 에이전트 노드 ── */}
              {positions.map((p) => {
                const isSelected = selectedAgent === p.name;
                const related = isRelated(p.name);
                const dimmed = selectedAgent && !related;

                return (
                  <g
                    key={p.name}
                    className="cursor-pointer"
                    onClick={() => setSelectedAgent(isSelected ? null : p.name)}
                    style={{
                      opacity: dimmed ? 0.15 : 1,
                      transition: "opacity 0.4s ease",
                    }}
                  >
                    {/* 선택 시 확산 링 */}
                    {isSelected && (
                      <>
                        <circle cx={p.x} cy={p.y} r="22" fill="none" stroke="#3adffa" strokeWidth="2" opacity="0.6">
                          <animate attributeName="r" values="22;38;22" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <circle cx={p.x} cy={p.y} r="22" fill="none" stroke="#3adffa" strokeWidth="1.5" opacity="0.4">
                          <animate attributeName="r" values="22;34;22" dur="2s" repeatCount="indefinite" begin="0.5s" />
                          <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" begin="0.5s" />
                        </circle>
                      </>
                    )}

                    {/* 활성 외부 링 */}
                    {p.active && !isSelected && (
                      <circle cx={p.x} cy={p.y} r="26" fill="none" stroke="#3adffa" strokeWidth="0.5" opacity="0.2">
                        <animate attributeName="r" values="26;30;26" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.2;0.05;0.2" dur="3s" repeatCount="indefinite" />
                      </circle>
                    )}

                    {/* 노드 본체 */}
                    <circle
                      cx={p.x} cy={p.y} r="22"
                      fill={isSelected ? "#0a2a3f" : p.active ? "#12192b" : "#0c1324"}
                      stroke={isSelected ? "#3adffa" : p.active ? "#3adffa" : "#424859"}
                      strokeWidth={isSelected ? 3 : p.active ? 1.5 : 1}
                      filter={isSelected ? "url(#glow-strong)" : p.active ? "url(#glow-soft)" : undefined}
                    >
                      {isSelected && (
                        <animate attributeName="r" values="22;24;22" dur="1s" repeatCount="indefinite" />
                      )}
                    </circle>

                    {/* 이니셜 */}
                    <text
                      x={p.x} y={p.y + 1}
                      textAnchor="middle" dominantBaseline="middle"
                      fill={isSelected ? "#ffffff" : p.active ? "#3adffa" : "#6f7588"}
                      fontSize={isSelected ? "14" : "12"}
                      fontWeight="bold" fontFamily="monospace"
                    >
                      {p.name.slice(0, 2).toUpperCase()}
                    </text>

                    {/* 이름 */}
                    <text
                      x={p.x} y={p.y + 38}
                      textAnchor="middle"
                      fill={isSelected ? "#3adffa" : p.active ? "#e0e5fb" : "#6f7588"}
                      fontSize={isSelected ? "10" : "9"}
                      fontWeight={isSelected || p.active ? "bold" : "normal"}
                      fontFamily="monospace"
                    >
                      {p.name}
                    </text>

                    {/* 활성 점 */}
                    {p.active && (
                      <circle cx={p.x + 16} cy={p.y - 16} r="4" fill="#9bffce" stroke="#12192b" strokeWidth="2">
                        <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                );
              })}

              {/* 중앙 허브 — message-bus.sh */}
              {/* 외부 회전 링 */}
              <circle cx={cx} cy={cy} r="52" fill="none" stroke="#3adffa" strokeWidth="0.5" strokeDasharray="3 8" opacity="0.2">
                <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="30s" repeatCount="indefinite" />
              </circle>
              <circle cx={cx} cy={cy} r="44" fill="none" stroke="#699cff" strokeWidth="0.5" strokeDasharray="5 12" opacity="0.15">
                <animateTransform attributeName="transform" type="rotate" from={`360 ${cx} ${cy}`} to={`0 ${cx} ${cy}`} dur="20s" repeatCount="indefinite" />
              </circle>

              {/* 글로우 배경 */}
              <circle cx={cx} cy={cy} r="38" fill="none" stroke="#3adffa" strokeWidth="1" opacity="0.08">
                <animate attributeName="r" values="36;40;36" dur="4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.08;0.15;0.08" dur="4s" repeatCount="indefinite" />
              </circle>

              {/* 메인 원 */}
              <circle cx={cx} cy={cy} r="34" fill="#0a1628" stroke="#3adffa" strokeWidth="1.5" opacity="0.9" filter="url(#glow-soft)" />

              {/* 내부 장식 링 */}
              <circle cx={cx} cy={cy} r="28" fill="none" stroke="#3adffa" strokeWidth="0.5" opacity="0.1" />

              {/* 아이콘 */}
              <text x={cx} y={cy - 8} textAnchor="middle" fill="#3adffa" fontSize="16" fontFamily="monospace" fontWeight="bold" filter="url(#glow-soft)">
                ⬡
              </text>
              {/* 텍스트 */}
              <text x={cx} y={cy + 6} textAnchor="middle" fill="#3adffa" fontSize="8" fontFamily="monospace" fontWeight="bold" opacity="0.9">
                message
              </text>
              <text x={cx} y={cy + 16} textAnchor="middle" fill="#3adffa" fontSize="8" fontFamily="monospace" fontWeight="bold" opacity="0.9">
                bus.sh
              </text>

              {/* 펄스 데코 */}
              <circle cx={cx} cy={cy} r="34" fill="none" stroke="#3adffa" strokeWidth="1" opacity="0">
                <animate attributeName="r" values="34;50;34" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>
        </div>

        {/* 범례 */}
        <div className="flex items-center justify-center gap-6 text-[10px] text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full border-2 border-primary bg-surface-container relative">
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-tertiary" />
            </span>
            <span>활성 ({activeAgents.size})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full border border-outline-variant bg-surface-container-low opacity-40" />
            <span>비활성 ({allAgents.length - activeAgents.size})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-0.5 bg-gradient-to-r from-primary to-secondary" />
            <span>통신 ({connections.length}건)</span>
          </div>
          {selectedAgent && (
            <button onClick={() => setSelectedAgent(null)} className="flex items-center gap-1 text-primary hover:underline">
              <MaterialIcon icon="close" size="xs" />
              필터 해제
            </button>
          )}
        </div>
      </GlassCard>

      {/* ── 통신 기록 ── */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-headline text-sm font-bold text-on-surface">
            {selectedAgent ? `${selectedAgent} 통신 기록` : "전체 통신 기록"}
          </h3>
          <span className="text-[10px] text-slate-500">{filteredMessages.length}건</span>
        </div>

        {filteredMessages.length > 0 ? (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {filteredMessages.slice(0, 20).map((msg) => (
              <div key={msg.messageId} className="flex items-start gap-3 p-3 bg-surface-container/30 rounded-lg hover:bg-surface-container/60 transition-colors">
                <div className="flex items-center gap-1.5 min-w-[120px] pt-0.5">
                  <span className="text-[10px] font-mono font-bold text-primary">{msg.from}</span>
                  <MaterialIcon icon="arrow_forward" size="xs" className="text-slate-600" />
                  <span className="text-[10px] font-mono font-bold text-secondary">{msg.to}</span>
                </div>
                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-sm border flex-shrink-0 ${TYPE_STYLES[msg.type] ?? "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>
                  {msg.type}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-on-surface truncate">{msg.subject}</p>
                  {msg.body && <p className="text-[10px] text-slate-500 truncate mt-0.5">{msg.body}</p>}
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-[10px] text-slate-500">{timeAgo(msg.timestamp)}</span>
                  <span className={`w-2 h-2 rounded-full ${msg.status === "unread" ? "bg-warning" : msg.status === "read" ? "bg-tertiary" : "bg-slate-600"}`} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <MaterialIcon icon="hub" size="xl" className="text-slate-600 mb-2" />
            <p className="text-sm">{selectedAgent ? `${selectedAgent}의 통신 기록이 없습니다` : "에이전트 간 통신 기록이 없습니다"}</p>
            <p className="text-[10px] mt-1">Claude Squad 또는 /discuss 스킬로 통신이 발생합니다</p>
          </div>
        )}
      </GlassCard>
    </>
  );
}
