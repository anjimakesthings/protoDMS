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
      className="status-badge"
      style={{
        background: cfg.bg,
        color: cfg.color,
        fontSize: size === 'sm' ? '0.68rem' : undefined,
      }}
    >
      {cfg.label}
    </span>
  )
}
