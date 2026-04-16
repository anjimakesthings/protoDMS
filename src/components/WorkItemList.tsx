import type { WorkItem } from '../types'
import { useApp } from '../context/AppContext'
import WorkItemCard from './WorkItemCard'

interface Props {
  onEdit: (item: WorkItem) => void
  onEditDirect: (item: WorkItem) => void
}

export default function WorkItemList({ onEdit, onEditDirect }: Props) {
  const { filteredWorkItems } = useApp()

  const sorted = [...filteredWorkItems].sort((a, b) => {
    if (!a.scheduledDate && !b.scheduledDate) return 0
    if (!a.scheduledDate) return -1
    if (!b.scheduledDate) return 1
    return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
  })

  const unscheduled = sorted.filter(i => !i.scheduledDate)
  const scheduled = sorted.filter(i => i.scheduledDate)

  return (
    <div className="flex flex-col" style={{ background: '#ffffff' }}>
      <div className="flex flex-col gap-2.5">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <p className="text-sm font-semibold text-gray-500">Inga ärenden</p>
            <p className="text-xs text-gray-400 mt-1">Justera filtret eller skapa ett nytt ärende</p>
          </div>
        ) : (
          <>
            {unscheduled.length > 0 && (
              <div className="flex flex-col gap-2.5">
                {unscheduled.map(item => (
                  <WorkItemCard key={item.id} item={item} onEdit={onEdit} onEditDirect={onEditDirect} unscheduled />
                ))}
              </div>
            )}
            {unscheduled.length > 0 && scheduled.length > 0 && (
              <div className="flex items-center gap-2 py-1">
                <div className="flex-1 h-px" style={{ background: '#e5e7eb' }} />
                <span className="text-xs text-gray-400">Schemalagda</span>
                <div className="flex-1 h-px" style={{ background: '#e5e7eb' }} />
              </div>
            )}
            {scheduled.map(item => (
              <WorkItemCard key={item.id} item={item} onEdit={onEdit} onEditDirect={onEditDirect} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
