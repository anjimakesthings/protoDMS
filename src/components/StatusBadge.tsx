import type { WorkItemStatus } from '../types'
import { STATUS_CONFIG } from '../types'

interface Props {
  status: WorkItemStatus
  size?: 'sm' | 'md'
}

export default function StatusBadge({ status, size = 'md' }: Props) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      className="status-badge inline-flex items-center gap-1"
      style={{
        background: cfg.bg,
        color: cfg.color,
        fontSize: size === 'sm' ? '0.68rem' : undefined,
      }}
    >
      {status === 'COMPLETED' && (
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
      {status === 'CANCELLED' && (
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={{ flexShrink: 0 }}>
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )}
      {cfg.label}
    </span>
  )
}
