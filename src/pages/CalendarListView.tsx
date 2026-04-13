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
  const [view] = useState<View>('month')
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

  const handlePrev = useCallback(() => {
    const d = new Date(currentDate)
    d.setMonth(d.getMonth() - 1)
    setCurrentDate(d)
  }, [currentDate])

  const handleNext = useCallback(() => {
    const d = new Date(currentDate)
    d.setMonth(d.getMonth() + 1)
    setCurrentDate(d)
  }, [currentDate])

  const handleToday = useCallback(() => {
    setCurrentDate(new Date())
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
    <div className="flex flex-col h-full overflow-hidden">
      {/* Filter bar with integrated month nav */}
      <FilterBar
        onCreateClick={() => { setInitialDate(null); setModalItem(null) }}
        currentDate={currentDate}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
      />

      {/* Split content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Calendar (70%) */}
        <div className="flex flex-col overflow-hidden" style={{ width: '70%' }}>
          <div className="flex-1 overflow-hidden p-4" style={{ background: '#f4f5f7' }}>
            <Calendar
              localizer={localizer}
              events={events}
              date={currentDate}
              view={view}
              onNavigate={handleNavigate}
              onView={() => {}}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              dayPropGetter={dayPropGetter}
              eventPropGetter={eventPropGetter}
              components={{ event: CustomEvent }}
              messages={SWEDISH_MESSAGES}
              culture="sv"
              style={{ height: '100%', background: '#fff', borderRadius: 8 }}
            />
          </div>
        </div>

        {/* Work item list (30%) */}
        <div className="overflow-hidden flex-shrink-0" style={{ width: '30%' }}>
          <WorkItemList onEdit={(item) => setModalItem(item)} />
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
