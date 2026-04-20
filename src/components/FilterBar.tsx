import { useState, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useApp } from '../context/AppContext'
import type { WorkItemStatus, WorkItemType } from '../types'
import { STATUS_CONFIG, TYPE_CONFIG } from '../types'

interface Props {
  onCreateClick: () => void
}

const STATUS_OPTIONS: Array<{ value: WorkItemStatus | 'ALL'; label: string }> = [
  { value: 'ALL',         label: 'Alla statusar' },
  { value: 'CREATED',     label: STATUS_CONFIG.CREATED.label },
  { value: 'PLANNED',     label: STATUS_CONFIG.PLANNED.label },
  { value: 'IN_PROGRESS', label: STATUS_CONFIG.IN_PROGRESS.label },
  { value: 'COMPLETED',   label: STATUS_CONFIG.COMPLETED.label },
  { value: 'INVOICED',    label: STATUS_CONFIG.INVOICED.label },
  { value: 'CANCELLED',   label: STATUS_CONFIG.CANCELLED.label },
]

const TYPE_OPTIONS: Array<{ value: WorkItemType | 'ALL'; label: string }> = [
  { value: 'ALL',       label: 'Alla typer' },
  { value: 'TRANSPORT', label: TYPE_CONFIG.TRANSPORT.label },
  { value: 'PICKUP',    label: TYPE_CONFIG.PICKUP.label },
]

// ─── Date helpers ─────────────────────────────────────────────────────────────
function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function fromISO(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}
function addDays(d: Date, n: number): Date {
  const r = new Date(d); r.setDate(r.getDate() + n); return r
}
function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}
function getMondayOf(d: Date): Date {
  const r = new Date(d)
  const day = r.getDay()
  r.setDate(r.getDate() + (day === 0 ? -6 : 1 - day))
  return r
}
function getDaysInGrid(monthStart: Date): (Date | null)[] {
  const year = monthStart.getFullYear()
  const month = monthStart.getMonth()
  const firstDow = monthStart.getDay()
  const leadingEmpties = firstDow === 0 ? 6 : firstDow - 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (Date | null)[] = Array(leadingEmpties).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

const MONTHS_SV = ['Januari','Februari','Mars','April','Maj','Juni','Juli','Augusti','September','Oktober','November','December']

function formatShort(iso: string) {
  return new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'short' }).format(fromISO(iso))
}
function formatLong(d: Date) {
  return new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' }).format(d)
}

interface Preset { id: string; label: string; desc: string; from: string | null; to: string | null }

function buildPresets(today: Date): Preset[] {
  const t = toISO(today)
  const mon = getMondayOf(today)
  const sun = addDays(mon, 6)
  return [
    { id: 'all',       label: 'Allt',                desc: '',                                                                        from: null, to: null },
    { id: 'today',     label: 'Idag',                desc: formatLong(today),                                                          from: t,    to: t },
    { id: 'this_week', label: 'Denna vecka',         desc: `${formatShort(toISO(mon))} – ${formatShort(toISO(sun))}`,                  from: toISO(mon), to: toISO(sun) },
    { id: 'next7',     label: 'Kommande 7 dagar',    desc: `${formatShort(t)} – ${formatShort(toISO(addDays(today, 6)))}`,             from: t,    to: toISO(addDays(today, 6)) },
    { id: 'next30',    label: 'Kommande 30 dagar',   desc: `${formatShort(t)} – ${formatShort(toISO(addDays(today, 29)))}`,            from: t,    to: toISO(addDays(today, 29)) },
    { id: 'next90',    label: 'Kommande 90 dagar',   desc: `${formatShort(t)} – ${formatShort(toISO(addDays(today, 89)))}`,            from: t,    to: toISO(addDays(today, 89)) },
    { id: 'custom',    label: 'Anpassat',            desc: '',                                                                        from: null, to: null },
  ]
}

function detectPreset(from: string | null, to: string | null, presets: Preset[]): string {
  if (!from && !to) return 'all'
  const match = presets.find(p => p.id !== 'custom' && p.id !== 'all' && p.from === from && p.to === to)
  return match ? match.id : 'custom'
}

// ─── DatePresetFilter ─────────────────────────────────────────────────────────
function DatePresetFilter({ from, to, onFrom, onTo }: {
  from: string | null
  to: string | null
  onFrom: (v: string | null) => void
  onTo: (v: string | null) => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d }, [])
  const presets = useMemo(() => buildPresets(today), [today])

  const [open, setOpen] = useState(false)
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 })
  const [localFrom, setLocalFrom] = useState<string | null>(from)
  const [localTo, setLocalTo] = useState<string | null>(to)
  const [selectedPreset, setSelectedPreset] = useState(() => detectPreset(from, to, presets))
  const [calMonth, setCalMonth] = useState(() => from ? startOfMonth(fromISO(from)) : startOfMonth(today))
  const [hoverDay, setHoverDay] = useState<string | null>(null)
  const [picking, setPicking] = useState<'from' | 'to'>('from')

  const isActive = !!(from || to)
  const todayISO = toISO(today)

  useEffect(() => {
    function onDown(e: MouseEvent) {
      const target = e.target as Node
      if (
        panelRef.current && !panelRef.current.contains(target) &&
        triggerRef.current && !triggerRef.current.contains(target)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  function openPanel() {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPanelPos({ top: rect.bottom + 8, left: rect.left })
    }
    setLocalFrom(from); setLocalTo(to)
    setSelectedPreset(detectPreset(from, to, presets))
    setCalMonth(from ? startOfMonth(fromISO(from)) : startOfMonth(today))
    setPicking('from'); setHoverDay(null); setOpen(true)
  }

  function handlePresetClick(p: Preset) {
    setSelectedPreset(p.id)
    if (p.id === 'all') { setLocalFrom(null); setLocalTo(null) }
    else if (p.id === 'custom') { setLocalFrom(null); setLocalTo(null); setPicking('from') }
    else { setLocalFrom(p.from); setLocalTo(p.to); if (p.from) setCalMonth(startOfMonth(fromISO(p.from))) }
  }

  function handleDayClick(iso: string) {
    if (picking === 'from' || !localFrom) {
      setLocalFrom(iso); setLocalTo(null); setPicking('to')
    } else {
      if (iso >= localFrom) { setLocalTo(iso); setPicking('from') }
      else { setLocalFrom(iso); setLocalTo(null) }
    }
    setSelectedPreset('custom'); setHoverDay(null)
  }

  function handleApply() { onFrom(localFrom); onTo(localTo); setOpen(false) }
  function handleCancel() { setOpen(false) }

  // Hover range end
  const effectiveTo = (picking === 'to' && hoverDay && localFrom && hoverDay > localFrom) ? hoverDay : localTo

  const label = isActive
    ? `Datum: ${[from ? formatShort(from) : '…', to ? formatShort(to) : '…'].join(' – ')}`
    : 'Datum'

  const cells = getDaysInGrid(calMonth)

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        ref={triggerRef}
        onClick={() => open ? setOpen(false) : openPanel()}
        className="filter-select flex items-center gap-1.5"
        style={{ minWidth: 0 }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        {label}
        {isActive && (
          <span
            onClick={e => { e.stopPropagation(); onFrom(null); onTo(null) }}
            className="ml-1 text-gray-400 hover:text-gray-600"
            title="Rensa"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </span>
        )}
      </button>

      {open && createPortal(
        <div ref={panelRef} className="date-picker-panel" style={{ position: 'fixed', top: panelPos.top, left: panelPos.left, zIndex: 9999 }}>
          <div className="date-picker-body">

            {/* ── Presets column ──────────────────── */}
            <div className="date-picker-presets">
              {presets.map(p => {
                const isSelected = selectedPreset === p.id
                const desc = p.id === 'custom' && isSelected && localFrom
                  ? `${formatShort(localFrom)}${localTo ? ` – ${formatShort(localTo)}` : ' – …'}`
                  : p.desc
                return (
                  <div
                    key={p.id}
                    className={`date-picker-preset-item${isSelected ? ' active' : ''}`}
                    onClick={() => handlePresetClick(p)}
                  >
                    <div className={`date-picker-radio${isSelected ? ' active' : ''}`} />
                    <div>
                      <div className="date-picker-preset-label">{p.label}</div>
                      {desc && <div className="date-picker-preset-desc">{desc}</div>}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* ── Calendar column ─────────────────── */}
            <div className="date-picker-calendar">
              <div className="date-picker-cal-header">
                <button
                  className="date-picker-nav-btn"
                  onClick={() => setCalMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                </button>
                <span className="date-picker-cal-month">
                  {MONTHS_SV[calMonth.getMonth()]} {calMonth.getFullYear()}
                </span>
                <button
                  className="date-picker-nav-btn"
                  onClick={() => setCalMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </div>

              <div className="date-picker-cal-grid">
                {['Mån','Tis','Ons','Tor','Fre','Lör','Sön'].map(d => (
                  <div key={d} className="date-picker-cal-weekday">{d}</div>
                ))}
                {cells.map((day, i) => {
                  if (!day) return <div key={`e${i}`} />
                  const iso = toISO(day)
                  const isFrom = iso === localFrom
                  const isTo = iso === localTo
                  const isHover = iso === effectiveTo && !isTo && iso !== localFrom
                  const inRange = !!(localFrom && effectiveTo && iso > localFrom && iso < effectiveTo)

                  const cls = [
                    'date-picker-cal-day',
                    iso === todayISO && !isFrom && !isTo ? 'today' : '',
                    isFrom ? 'dp-from' : '',
                    isTo ? 'dp-to' : '',
                    isHover ? 'dp-hover-end' : '',
                    inRange ? 'in-range' : '',
                  ].filter(Boolean).join(' ')

                  return (
                    <div
                      key={iso}
                      className={cls}
                      onClick={() => handleDayClick(iso)}
                      onMouseEnter={() => { if (picking === 'to') setHoverDay(iso) }}
                      onMouseLeave={() => { if (picking === 'to') setHoverDay(null) }}
                    >
                      {day.getDate()}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── Footer ─────────────────────────────── */}
          <div className="date-picker-footer">
            <button className="btn-secondary" onClick={handleCancel}>Avbryt</button>
            <button className="btn-primary" onClick={handleApply}>Tillämpa</button>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

// ─── FilterBar ────────────────────────────────────────────────────────────────
export default function FilterBar({ onCreateClick: _onCreateClick }: Props) {
  const { users, filterStatus, filterType, filterUserId, filterDateFrom, filterDateTo, setFilterStatus, setFilterType, setFilterUserId, setFilterDateFrom, setFilterDateTo } = useApp()

  const isStatusFiltered = filterStatus !== 'ALL'
  const isTypeFiltered = filterType !== 'ALL'
  const isUserFiltered = filterUserId !== 'ALL'
  const isDateFiltered = !!(filterDateFrom || filterDateTo)
  const isAnyFiltered = isStatusFiltered || isTypeFiltered || isUserFiltered || isDateFiltered

  function resetAllFilters() {
    setFilterStatus('ALL')
    setFilterType('ALL')
    setFilterUserId('ALL')
    setFilterDateFrom(null)
    setFilterDateTo(null)
  }

  return (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <select
        className="filter-select"
        value={filterStatus}
        onChange={e => setFilterStatus(e.target.value as WorkItemStatus | 'ALL')}
      >
        {STATUS_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <select
        className="filter-select"
        value={filterType}
        onChange={e => setFilterType(e.target.value as WorkItemType | 'ALL')}
      >
        {TYPE_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <select
        className="filter-select"
        value={filterUserId}
        onChange={e => setFilterUserId(e.target.value)}
      >
        <option value="ALL">Alla personer</option>
        {users.map(u => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </select>

      <DatePresetFilter
        from={filterDateFrom}
        to={filterDateTo}
        onFrom={setFilterDateFrom}
        onTo={setFilterDateTo}
      />

      {isAnyFiltered && (
        <button
          onClick={resetAllFilters}
          title="Återställ filter"
          className="flex items-center justify-center w-6 h-6 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  )
}
