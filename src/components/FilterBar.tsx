import { useApp } from '../context/AppContext'
import type { WorkItemStatus, WorkItemType } from '../types'
import { STATUS_CONFIG, TYPE_CONFIG } from '../types'

interface Props {
  onCreateClick: () => void
}

const STATUS_OPTIONS: Array<{ value: WorkItemStatus | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'Alla' },
  { value: 'CREATED', label: STATUS_CONFIG.CREATED.label },
  { value: 'PLANNED', label: STATUS_CONFIG.PLANNED.label },
  { value: 'IN_PROGRESS', label: STATUS_CONFIG.IN_PROGRESS.label },
  { value: 'COMPLETED', label: STATUS_CONFIG.COMPLETED.label },
  { value: 'CANCELLED', label: STATUS_CONFIG.CANCELLED.label },
]

const TYPE_OPTIONS: Array<{ value: WorkItemType | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'Alla typer' },
  { value: 'TRANSPORT', label: TYPE_CONFIG.TRANSPORT.icon + ' ' + TYPE_CONFIG.TRANSPORT.label },
  { value: 'GENERAL', label: TYPE_CONFIG.GENERAL.icon + ' ' + TYPE_CONFIG.GENERAL.label },
]

export default function FilterBar({ onCreateClick }: Props) {
  const { filterStatus, filterType, setFilterStatus, setFilterType, filteredWorkItems, workItems } = useApp()

  return (
    <div className="flex items-center gap-3 flex-wrap px-5 py-3 bg-white border-b border-gray-200">
      {/* Status chips */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {STATUS_OPTIONS.map(opt => (
          <button
            key={opt.value}
            className={`filter-chip ${filterStatus === opt.value ? 'active' : ''}`}
            data-value={opt.value === 'ALL' ? 'ALL' : undefined}
            data-status={opt.value !== 'ALL' ? opt.value : undefined}
            onClick={() => setFilterStatus(opt.value as WorkItemStatus | 'ALL')}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-gray-200 mx-1" />

      {/* Type chips */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {TYPE_OPTIONS.map(opt => (
          <button
            key={opt.value}
            className={`filter-chip ${filterType === opt.value ? 'active' : ''}`}
            data-value={opt.value === 'ALL' ? 'ALL' : undefined}
            data-type={opt.value !== 'ALL' ? opt.value : undefined}
            onClick={() => setFilterType(opt.value as WorkItemType | 'ALL')}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Count */}
      <span className="text-xs text-gray-400 ml-1">
        {filteredWorkItems.length} av {workItems.length}
      </span>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Create button */}
      <button className="btn-primary flex items-center gap-1.5" onClick={onCreateClick}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Skapa ärende
      </button>
    </div>
  )
}
