import { MaterialIcon } from "@/components/ui/MaterialIcon";
import type { AgentMessage } from "@/types/message";

interface AlertBannerProps {
  alerts: AgentMessage[];
  hookFails: number;
}

export function AlertBanner({ alerts, hookFails }: AlertBannerProps) {
  const totalIssues = alerts.length + (hookFails > 0 ? 1 : 0);

  if (totalIssues === 0) return null;

  return (
    <div className="mb-6 p-4 bg-error/5 border border-error/20 rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <MaterialIcon icon="notifications_active" size="sm" className="text-error" />
        <span className="text-sm font-bold text-error">
          {totalIssues}건의 알림
        </span>
      </div>

      <div className="space-y-2">
        {hookFails > 0 && (
          <div className="flex items-center gap-2 text-xs text-error/80">
            <MaterialIcon icon="error" size="xs" className="text-error" />
            <span>
              훅 파이프라인에서 <strong>{hookFails}건</strong> 실패 발생 — 빌드
              로그에서 상세 확인
            </span>
          </div>
        )}
        {alerts.map((alert) => (
          <div
            key={alert.messageId}
            className="flex items-center gap-2 text-xs text-warning"
          >
            <MaterialIcon icon="mail" size="xs" className="text-warning" />
            <span>
              <strong>[{alert.from} → {alert.to}]</strong> {alert.subject}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
