import type { WorkItem } from '../types'
import { useApp } from '../context/AppContext'
import StatusBadge from './StatusBadge'

interface Props {
  item: WorkItem
  onEdit: (item: WorkItem) => void
  onEditDirect: (item: WorkItem) => void
  unscheduled?: boolean
}

function formatDate(iso: string | null): string {
  if (!iso) return 'Ej schemalagd'
  return new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'short' }).format(new Date(iso))
}

function formatCreatedAt(iso: string): string {
  return new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}

// Type icon SVGs
function TransportIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 4v4h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
}

const ICON_COLORS = { bg: '#e0f2fe', color: '#0284c7' }

export default function WorkItemCard({ item, onEdit, onEditDirect, unscheduled }: Props) {
  const { users, deleteWorkItem } = useApp()
  const assignedUsers = users.filter(u => item.assignedToUserIds.includes(u.id))
  const isCompleted = item.status === 'COMPLETED' || item.status === 'CANCELLED'

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    if (confirm(`Ta bort ärendet "${item.title}" permanent?`)) {
      deleteWorkItem(item.id)
    }
  }

  return (
    <div
      className="work-item-card group flex items-start gap-3 cursor-pointer"
      style={isCompleted ? { opacity: 0.5 } : unscheduled ? { borderColor: '#fec301', borderLeftWidth: 3, background: '#fffdf5' } : {}}
      onClick={() => onEdit(item)}
    >
      {/* Type icon */}
      <div
        className="flex items-center justify-center rounded-xl flex-shrink-0"
        style={{
          width: 52,
          height: 52,
          background: item.status === 'COMPLETED' ? '#dcfce7' : ICON_COLORS.bg,
          color: item.status === 'COMPLETED' ? '#16a34a' : ICON_COLORS.color,
        }}
      >
        {item.status === 'COMPLETED' ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <TransportIcon />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div
          className="text-base font-semibold leading-snug mb-0.5 truncate"
          style={{ color: '#111827' }}
          title={item.title}
        >
          {item.title}
        </div>
        <div className="flex flex-col gap-0.5 mt-0.5" style={{ color: '#6b7280', fontSize: '0.72rem', lineHeight: '1.4' }}>
          {item.status === 'CREATED' && <div>Inkommen: {formatCreatedAt(item.createdAt)}</div>}
          <div className="flex items-center gap-1.5">
            <span>Transport</span>
            {item.scheduledDate && (
              <>
                <span>·</span>
                <span>{formatDate(item.scheduledDate)}</span>
              </>
            )}
            {assignedUsers.length > 0 && (
              <>
                <span>·</span>
                <span>{assignedUsers.map(u => u.name).join(', ')}</span>
              </>
            )}
          </div>
          {item.transport?.deliveryAddress && (
            <div className="truncate">{item.transport.deliveryAddress}</div>
          )}
        </div>
      </div>

      {/* Status badge + hover actions */}
      <div className="flex flex-col items-end justify-between self-stretch flex-shrink-0">
        <StatusBadge status={item.status} size="sm" />
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Pen — only for non-CREATED, since those open in edit directly */}
          {item.status !== 'CREATED' && (
            <button
              title="Redigera"
              onClick={e => { e.stopPropagation(); onEditDirect(item) }}
              className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          )}
          {/* Delete */}
          <button
            title="Ta bort"
            onClick={handleDelete}
            className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
