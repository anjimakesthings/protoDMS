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
      className={`status-badge inline-flex items-center gap-1${size === 'sm' ? ' text-xs' : ''}`}
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {status === 'COMPLETED' && (
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
      {status === 'CANCELLED' && (
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="shrink-0">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )}
      {cfg.label}
    </span>
  )
}
