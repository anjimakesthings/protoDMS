import { useNavigate } from 'react-router-dom'
import type { WorkItem } from '../types'
import { TYPE_CONFIG, STATUS_CONFIG } from '../types'
import { useApp } from '../context/AppContext'
import StatusBadge from './StatusBadge'

interface Props {
  item: WorkItem
  onEdit: (item: WorkItem) => void
}

function formatDate(iso: string | null): string {
  if (!iso) return 'Ej schemalagd'
  return new Intl.DateTimeFormat('sv-SE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date(iso))
}

export default function WorkItemCard({ item, onEdit }: Props) {
  const { users, updateWorkItem, deleteWorkItem } = useApp()
  const navigate = useNavigate()
  const assignedUser = item.assignedToUserId ? users.find(u => u.id === item.assignedToUserId) : null
  const typeCfg = TYPE_CONFIG[item.type]

  function handleCancel(e: React.MouseEvent) {
    e.stopPropagation()
    if (confirm(`Avbryt ärendet "${item.title}"?`)) {
      updateWorkItem(item.id, { status: 'CANCELLED' })
    }
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    if (confirm(`Ta bort ärendet "${item.title}" permanent?`)) {
      deleteWorkItem(item.id)
    }
  }

  const completedActions = item.actions.filter(a => a.completed).length

  return (
    <div className="work-item-card group">
      {/* Top row */}
      <div className="flex items-start justify-between mb-2">
        <StatusBadge status={item.status} size="sm" />
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {item.status !== 'CANCELLED' && item.status !== 'COMPLETED' && (
            <button
              title="Avbryt ärende"
              onClick={handleCancel}
              className="p-1 rounded text-gray-400 hover:text-amber-500 hover:bg-amber-50 transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </button>
          )}
          <button
            title="Ta bort"
            onClick={handleDelete}
            className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Title */}
      <div
        className="font-semibold text-gray-800 text-sm mb-1.5 leading-snug cursor-pointer hover:text-yellow-600 transition-colors"
        style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        onClick={() => navigate(`/arenden/${item.id}`)}
        title={item.title}
      >
        {item.title}
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 flex-wrap">
        <span style={{ color: typeCfg.color }}>{typeCfg.icon} {typeCfg.label}</span>
        <span className="text-gray-300">|</span>
        <span>{assignedUser ? assignedUser.name : <span className="text-gray-400 italic">Ej tilldelad</span>}</span>
      </div>

      {/* Actions progress (if any) */}
      {item.actions.length > 0 && (
        <div className="mb-2">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Åtgärder</span>
            <span>{completedActions}/{item.actions.length}</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${item.actions.length > 0 ? (completedActions / item.actions.length) * 100 : 0}%`,
                background: STATUS_CONFIG[item.status].color,
              }}
            />
          </div>
        </div>
      )}

      {/* Date */}
      <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        {formatDate(item.scheduledDate)}
      </div>

      {/* Actions */}
      <button
        className="btn-secondary w-full text-xs py-1.5"
        onClick={() => onEdit(item)}
      >
        Öppna
      </button>
    </div>
  )
}
