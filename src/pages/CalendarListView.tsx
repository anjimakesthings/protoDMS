import { useState, useCallback, useMemo } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import type { SlotInfo, EventProps } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { sv } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import type { WorkItem } from '../types'
import { STATUS_CONFIG } from '../types'
import { useApp } from '../context/AppContext'
import FilterBar from '../components/FilterBar'
import WorkItemList from '../components/WorkItemList'
import WorkItemModal from '../components/WorkItemModal'

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales: { 'sv': sv },
})

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource: WorkItem
}

function CustomEvent({ event }: EventProps<CalendarEvent>) {
  const item = event.resource
  const statusCfg = STATUS_CONFIG[item.status]
  return (
    <div
      title={item.title}
      style={{
        background: statusCfg.bg,
        borderLeft: `3px solid ${statusCfg.color}`,
        color: statusCfg.color,
        borderRadius: 4,
        padding: '1px 5px',
        fontSize: '0.72rem',
        fontWeight: 600,
        overflow: 'hidden',
      }}
    >
      <span className="inline-flex items-center gap-1" style={{ maxWidth: '100%' }}>
        {item.status === 'COMPLETED' && (
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        {item.status === 'CANCELLED' && (
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={{ flexShrink: 0 }}>
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        )}
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</span>
      </span>
    </div>
  )
}

const SWEDISH_MESSAGES = {
  allDay: 'Heldag',
  previous: '‹',
  next: '›',
  today: 'Idag',
  month: 'Månad',
  week: 'Vecka',
  day: 'Dag',
  agenda: 'Agenda',
  date: 'Datum',
  time: 'Tid',
  event: 'Ärende',
  showMore: (count: number) => `+${count} till`,
  noEventsInRange: 'Inga ärenden',
}

export default function CalendarListView() {
  const { filteredWorkItems } = useApp()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day' | 'agenda'>('month')
  const [modalItem, setModalItem] = useState<WorkItem | null | undefined>(undefined)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create')
  const [initialDate, setInitialDate] = useState<string | null>(null)

  // undefined = modal closed, null = create mode, WorkItem = edit/view mode
  const isModalOpen = modalItem !== undefined

  function openItem(item: WorkItem, mode: 'edit' | 'view') {
    setModalMode(mode)
    setModalItem(item)
  }

  const events: CalendarEvent[] = useMemo(() =>
    filteredWorkItems
      .filter(item => item.scheduledDate)
      .map(item => {
        const start = new Date(item.scheduledDate!)
        const end = new Date(start.getTime() + 60 * 60 * 1000)
        return { id: item.id, title: item.title, start, end, resource: item }
      }),
    [filteredWorkItems]
  )

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    openItem(event.resource, event.resource.status === 'CREATED' ? 'edit' : 'view')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSelectSlot = useCallback((slot: SlotInfo) => {
    setInitialDate(slot.start.toISOString().slice(0, 10))
    setModalItem(null)
  }, [])

  const handleNavigate = useCallback((date: Date) => {
    setCurrentDate(date)
  }, [])

  // Custom day prop getter for booking density tinting
  const dayPropGetter = useCallback((date: Date) => {
    const dateStr = date.toISOString().slice(0, 10)
    const count = filteredWorkItems.filter(item =>
      item.scheduledDate && item.scheduledDate.slice(0, 10) === dateStr
    ).length
    if (count >= 3) return { style: { background: '#fef9e7' } }
    if (count >= 1) return { style: { background: '#fffdf5' } }
    return {}
  }, [filteredWorkItems])

  const eventPropGetter = useCallback(() => ({
    style: { background: 'transparent', border: 'none', padding: 0 }
  }), [])

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

        {/* Columns: list LEFT (432px), calendar RIGHT (flex-1) */}
        <div className="flex gap-8">

          {/* Work item list */}
          <div style={{ width: 432, flexShrink: 0 }}>
            <WorkItemList
            onEdit={(item) => openItem(item, item.status === 'CREATED' ? 'edit' : 'view')}
            onEditDirect={(item) => openItem(item, 'edit')}
          />
          </div>

          {/* Calendar column */}
          <div className="flex flex-col flex-1 min-w-0">
            <Calendar
              localizer={localizer}
              events={events}
              date={currentDate}
              view={view}
              onNavigate={handleNavigate}
              onView={(v) => setView(v as 'month' | 'week' | 'day' | 'agenda')}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              dayPropGetter={dayPropGetter}
              eventPropGetter={eventPropGetter}
              components={{ event: CustomEvent }}
              messages={SWEDISH_MESSAGES}
              culture="sv"
              style={{ height: 680, background: 'transparent', borderRadius: 8 }}
            />
          </div>
        </div>
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
