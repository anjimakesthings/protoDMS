import type { WorkItem } from '../types'
import { useApp } from '../context/AppContext'
import WorkItemCard from './WorkItemCard'

interface Props {
  onEdit: (item: WorkItem) => void
}

export default function WorkItemList({ onEdit }: Props) {
  const { filteredWorkItems } = useApp()

  return (
    <div className="flex flex-col" style={{ background: '#faf8f5' }}>
      {/* Header */}
      <div className="flex items-center justify-between py-3 flex-shrink-0">
        <span className="text-lg font-semibold" style={{ color: '#111827' }}>Ärenden</span>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: '#e5e7eb', color: '#374151' }}
        >
          {filteredWorkItems.length}
        </span>
      </div>

      {/* List */}
      <div className="p-3 flex flex-col gap-2.5">
        {filteredWorkItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-sm font-semibold text-gray-500">Inga ärenden</p>
            <p className="text-xs text-gray-400 mt-1">Justera filtret eller skapa ett nytt ärende</p>
          </div>
        ) : (
          filteredWorkItems.map(item => (
            <WorkItemCard key={item.id} item={item} onEdit={onEdit} />
          ))
        )}
      </div>
    </div>
  )
}
