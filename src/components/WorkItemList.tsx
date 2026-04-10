import type { WorkItem } from '../types'
import { useApp } from '../context/AppContext'
import WorkItemCard from './WorkItemCard'

interface Props {
  onEdit: (item: WorkItem) => void
}

export default function WorkItemList({ onEdit }: Props) {
  const { filteredWorkItems } = useApp()

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: '#f7f8fa' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 flex-shrink-0"
        style={{ borderLeft: '1px solid #e2e8f0' }}
      >
        <span className="text-sm font-semibold text-gray-700">Ärenden</span>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: '#f1f5f9', color: '#64748b' }}
        >
          {filteredWorkItems.length}
        </span>
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-1 p-3 flex flex-col gap-2.5">
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
