import { useState } from 'react'
import type { WorkItem } from '../types'
import { useApp } from '../context/AppContext'
import FilterBar from '../components/FilterBar'
import WorkItemList from '../components/WorkItemList'
import WorkItemModal from '../components/WorkItemModal'

export default function CalendarListView() {
  const { filteredWorkItems, canCreate } = useApp()
  const [modalItem, setModalItem] = useState<WorkItem | null | undefined>(undefined)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create')
  const [initialDate, setInitialDate] = useState<string | null>(null)

  const isModalOpen = modalItem !== undefined

  function openItem(item: WorkItem, mode: 'edit' | 'view') {
    setModalMode(mode)
    setModalItem(item)
  }

  return (
    <div className="flex flex-col bg-white">

      {/* Header + filter — single shadowed block */}
      <div className="border-b border-gray-200 mb-9 shadow-[0_6px_16px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between px-6 mt-5 mb-1 w-full">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold text-gray-900">Ärenden</span>
            <span className="text-sm font-semibold rounded-full flex items-center justify-center bg-gray-200 text-gray-700 min-w-7 h-7 px-1">
              {filteredWorkItems.length}
            </span>
          </div>
          {canCreate && (
            <button
              className="btn-primary flex items-center gap-1.5"
              onClick={() => { setInitialDate(null); setModalItem(null) }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Nytt ärende
            </button>
          )}
        </div>

        <div className="relative">
          <div className="overflow-x-auto scrollbar-hide px-6 py-4">
            <FilterBar onCreateClick={() => {}} />
          </div>
          {/* Right fade gradient — hints at horizontal scroll on mobile */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent" />
        </div>
      </div>

      {/* Work item list */}
      <div className="px-6">
        <WorkItemList
          onEdit={(item) => openItem(item, item.status === 'CREATED' ? 'edit' : 'view')}
        />
      </div>

      {isModalOpen && (
        <WorkItemModal
          item={modalItem ?? null}
          initialDate={initialDate}
          initialMode={modalMode}
          onClose={() => { setModalItem(undefined); setInitialDate(null) }}
        />
      )}
    </div>
  )
}
