import type { WorkItem, WorkItemStatus } from '../types'
import { STATUS_CONFIG } from '../types'
import { useApp } from '../context/AppContext'
import WorkItemCard from './WorkItemCard'

interface Props {
  onEdit: (item: WorkItem) => void
  onEditDirect: (item: WorkItem) => void
}

const STATUS_ORDER: WorkItemStatus[] = ['CREATED', 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'INVOICED', 'CANCELLED']

export default function WorkItemList({ onEdit, onEditDirect }: Props) {
  const { filteredWorkItems } = useApp()

  if (filteredWorkItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <p className="text-sm font-semibold text-gray-500">Inga ärenden</p>
        <p className="text-xs text-gray-400 mt-1">Justera filtret eller skapa ett nytt ärende</p>
      </div>
    )
  }

  const grouped = STATUS_ORDER.map(status => ({
    status,
    items: filteredWorkItems.filter(i => i.status === status).sort((a, b) => {
      if (!a.scheduledDate && !b.scheduledDate) return 0
      if (!a.scheduledDate) return 1
      if (!b.scheduledDate) return -1
      return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
    }),
  })).filter(group => group.items.length > 0)

  return (
    <div className="flex flex-col gap-6">
      {grouped.map(({ status, items }) => {
        const cfg = STATUS_CONFIG[status]
        return (
          <div key={status}>
            <div className="flex items-center gap-3 mb-2.5">
              <div className="flex-1 h-px" style={{ background: '#e5e7eb' }} />
              <span className="text-xs font-semibold tracking-wide" style={{ color: '#9ca3af' }}>
                {cfg.label.toUpperCase()} ({items.length})
              </span>
              <div className="flex-1 h-px" style={{ background: '#e5e7eb' }} />
            </div>
            <div className="flex flex-col gap-2.5">
              {items.map(item => (
                <WorkItemCard key={item.id} item={item} onEdit={onEdit} onEditDirect={onEditDirect} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
