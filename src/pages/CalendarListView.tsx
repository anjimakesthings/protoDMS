import { useState } from 'react'
import type { WorkItem } from '../types'
import { useApp } from '../context/AppContext'
import FilterBar from '../components/FilterBar'
import WorkItemList from '../components/WorkItemList'
import WorkItemModal from '../components/WorkItemModal'

export default function CalendarListView() {
  const { filteredWorkItems } = useApp()
  const [modalItem, setModalItem] = useState<WorkItem | null | undefined>(undefined)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create')
  const [initialDate, setInitialDate] = useState<string | null>(null)

  // undefined = modal closed, null = create mode, WorkItem = edit/view mode
  const isModalOpen = modalItem !== undefined

  function openItem(item: WorkItem, mode: 'edit' | 'view') {
    setModalMode(mode)
    setModalItem(item)
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col px-6 py-4" style={{ background: '#ffffff' }}>

        {/* Full-width header: title + count left, create button right */}
        <div className="flex items-center justify-between" style={{ marginTop: 20, marginBottom: 20 }}>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold" style={{ color: '#111827' }}>Ärenden</span>
            <span
              className="text-sm font-semibold rounded-full flex items-center justify-center"
              style={{ background: '#e5e7eb', color: '#374151', minWidth: 28, height: 28 }}
            >
              {filteredWorkItems.length}
            </span>
          </div>
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
        </div>

        {/* Full-width filter row */}
        <div
          className="flex items-center justify-between py-2"
          style={{ borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', marginBottom: 36 }}
        >
          <FilterBar onCreateClick={() => {}} />
        </div>

        {/* Work item list */}
        <WorkItemList
          onEdit={(item) => openItem(item, item.status === 'CREATED' ? 'edit' : 'view')}
          onEditDirect={(item) => openItem(item, 'edit')}
        />
      </div>

      {/* Modal */}
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
