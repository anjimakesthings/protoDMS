import { useApp } from '../context/AppContext'
import type { WorkItemStatus, WorkItemType } from '../types'
import { STATUS_CONFIG, TYPE_CONFIG } from '../types'

interface Props {
  onCreateClick: () => void
}

const STATUS_OPTIONS: Array<{ value: WorkItemStatus | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'Alla status' },
  { value: 'CREATED',     label: STATUS_CONFIG.CREATED.label },
  { value: 'PLANNED',     label: STATUS_CONFIG.PLANNED.label },
  { value: 'IN_PROGRESS', label: STATUS_CONFIG.IN_PROGRESS.label },
  { value: 'COMPLETED',   label: STATUS_CONFIG.COMPLETED.label },
  { value: 'CANCELLED',   label: STATUS_CONFIG.CANCELLED.label },
]

const TYPE_OPTIONS: Array<{ value: WorkItemType | 'ALL'; label: string }> = [
  { value: 'ALL',       label: 'Alla typer' },
  { value: 'TRANSPORT', label: TYPE_CONFIG.TRANSPORT.icon + ' ' + TYPE_CONFIG.TRANSPORT.label },
  { value: 'GENERAL',   label: TYPE_CONFIG.GENERAL.icon + ' ' + TYPE_CONFIG.GENERAL.label },
]

export default function FilterBar({ onCreateClick }: Props) {
  const { filterStatus, filterType, setFilterStatus, setFilterType } = useApp()

  const isStatusFiltered = filterStatus !== 'ALL'
  const isTypeFiltered = filterType !== 'ALL'

  return (
    <div className="flex items-center justify-between w-full">
      {/* Left: filter dropdowns */}
      <div className="flex items-center gap-3">
        <select
          className="filter-select"
          style={isStatusFiltered ? {
            borderColor: STATUS_CONFIG[filterStatus as WorkItemStatus].color,
            color: STATUS_CONFIG[filterStatus as WorkItemStatus].color,
            background: STATUS_CONFIG[filterStatus as WorkItemStatus].bg,
          } : {}}
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as WorkItemStatus | 'ALL')}
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <select
          className="filter-select"
          style={isTypeFiltered ? {
            borderColor: TYPE_CONFIG[filterType as WorkItemType].color,
            color: TYPE_CONFIG[filterType as WorkItemType].color,
            background: `${TYPE_CONFIG[filterType as WorkItemType].color}18`,
          } : {}}
          value={filterType}
          onChange={e => setFilterType(e.target.value as WorkItemType | 'ALL')}
        >
          {TYPE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Right: create button */}
      <button className="btn-primary flex items-center gap-1.5" onClick={onCreateClick}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Nytt ärende
      </button>
    </div>
  )
}
