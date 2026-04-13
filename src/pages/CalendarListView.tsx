import { useState, useCallback, useMemo } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import type { View, SlotInfo, EventProps } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { sv } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import type { WorkItem } from '../types'
import { STATUS_CONFIG, TYPE_CONFIG } from '../types'
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
  const typeCfg = TYPE_CONFIG[item.type]
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
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {typeCfg.icon} {item.title}
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
  const [view, setView] = useState<View>('month')
  const [modalItem, setModalItem] = useState<WorkItem | null | undefined>(undefined)
  const [initialDate, setInitialDate] = useState<string | null>(null)

  // undefined = modal closed, null = create mode, WorkItem = edit mode
  const isModalOpen = modalItem !== undefined

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
    setModalItem(event.resource)
  }, [])

  const handleSelectSlot = useCallback((slot: SlotInfo) => {
    setInitialDate(slot.start.toISOString().slice(0, 10))
    setModalItem(null)
  }, [])

  const handleNavigate = useCallback((date: Date) => {
    setCurrentDate(date)
  }, [])

  const handlePrev = () => {
    const d = new Date(currentDate)
    d.setMonth(d.getMonth() - 1)
    setCurrentDate(d)
  }

  const handleNext = () => {
    const d = new Date(currentDate)
    d.setMonth(d.getMonth() + 1)
    setCurrentDate(d)
  }

  const handleToday = () => setCurrentDate(new Date())

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

  const monthLabel = new Intl.DateTimeFormat('sv-SE', { month: 'long', year: 'numeric' })
    .format(currentDate)
    .replace(/^./, c => c.toUpperCase())

  return (
    <div className="flex flex-col">
      {/* Beige content area — filter row + columns */}
      <div className="flex flex-col gap-4 px-6 py-4" style={{ background: '#faf8f5' }}>

        {/* Filter row — dropdowns left, button right, sits on beige */}
        <FilterBar onCreateClick={() => { setInitialDate(null); setModalItem(null) }} />

        {/* Columns: list LEFT (432px), calendar RIGHT (flex-1) */}
        <div className="flex gap-4">

          {/* Work item list */}
          <div style={{ width: 432, flexShrink: 0 }}>
            <WorkItemList onEdit={(item) => setModalItem(item)} />
          </div>

          {/* Calendar column */}
          <div className="flex flex-col flex-1 min-w-0">
            {/* Calendar toolbar: month nav left, view tabs right */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <button onClick={handlePrev} className="nav-arrow-btn" aria-label="Föregående månad">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button onClick={handleToday} className="month-label-btn">{monthLabel}</button>
                <button onClick={handleNext} className="nav-arrow-btn" aria-label="Nästa månad">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
              {/* View switcher tabs */}
              <div className="flex items-center gap-1">
                {(['month', 'week', 'day', 'agenda'] as View[]).map(v => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors"
                    style={view === v
                      ? { background: '#fec301', color: '#1a1a1a' }
                      : { background: '#fff', color: '#374151', border: '1px solid #e5e7eb' }
                    }
                  >
                    {v === 'month' ? 'Månad' : v === 'week' ? 'Vecka' : v === 'day' ? 'Dag' : 'Agenda'}
                  </button>
                ))}
              </div>
            </div>
            <Calendar
              localizer={localizer}
              events={events}
              date={currentDate}
              view={view}
              onNavigate={handleNavigate}
              onView={setView}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              dayPropGetter={dayPropGetter}
              eventPropGetter={eventPropGetter}
              components={{ event: CustomEvent }}
              messages={SWEDISH_MESSAGES}
              culture="sv"
              style={{ height: 680, background: '#fff', borderRadius: 8 }}
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <WorkItemModal
          item={modalItem ?? null}
          initialDate={initialDate}
          onClose={() => { setModalItem(undefined); setInitialDate(null) }}
        />
      )}
    </div>
  )
}
