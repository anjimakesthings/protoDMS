import { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import type { WorkItemStatus, WorkItemType } from '../types'
import { STATUS_CONFIG, TYPE_CONFIG } from '../types'

interface Props {
  onCreateClick: () => void
}

const STATUS_OPTIONS: Array<{ value: WorkItemStatus | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'Alla statusar' },
  { value: 'CREATED',     label: STATUS_CONFIG.CREATED.label },
  { value: 'PLANNED',     label: STATUS_CONFIG.PLANNED.label },
  { value: 'IN_PROGRESS', label: STATUS_CONFIG.IN_PROGRESS.label },
  { value: 'COMPLETED',   label: STATUS_CONFIG.COMPLETED.label },
  { value: 'CANCELLED',   label: STATUS_CONFIG.CANCELLED.label },
]

const TYPE_OPTIONS: Array<{ value: WorkItemType | 'ALL'; label: string }> = [
  { value: 'ALL',       label: 'Alla typer' },
  { value: 'TRANSPORT', label: TYPE_CONFIG.TRANSPORT.icon + ' ' + TYPE_CONFIG.TRANSPORT.label },
  { value: 'GENERAL',   label: TYPE_CONFIG.GENERAL.icon + ' ' + TYPE_CONFIG.GENERAL.label },
]

function formatShort(iso: string) {
  return new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'short' }).format(new Date(iso))
}

function DateRangeFilter({ from, to, onFrom, onTo }: {
  from: string | null
  to: string | null
  onFrom: (v: string | null) => void
  onTo: (v: string | null) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isActive = from || to

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const label = isActive
    ? [from ? formatShort(from) : '…', to ? formatShort(to) : '…'].join(' – ')
    : 'Datum'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="filter-select flex items-center gap-1.5"
        style={isActive ? { borderColor: '#0ea5e9', color: '#0ea5e9', background: '#f0f9ff', minWidth: 0 } : { minWidth: 0 }}
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
            className="ml-1 text-sky-400 hover:text-sky-600"
            title="Rensa"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 z-50 rounded-lg border border-gray-200 bg-white shadow-lg p-3 flex flex-col gap-2"
          style={{ minWidth: 220 }}
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Från</label>
            <input
              type="date"
              value={from ?? ''}
              onChange={e => onFrom(e.target.value || null)}
              className="text-sm border border-gray-200 rounded-md px-2 py-1 outline-none focus:border-sky-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Till</label>
            <input
              type="date"
              value={to ?? ''}
              onChange={e => onTo(e.target.value || null)}
              className="text-sm border border-gray-200 rounded-md px-2 py-1 outline-none focus:border-sky-400"
            />
          </div>
          {isActive && (
            <button
              onClick={() => { onFrom(null); onTo(null) }}
              className="text-xs text-gray-400 hover:text-gray-600 text-left mt-1"
            >
              Rensa filter
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function FilterBar({ onCreateClick: _onCreateClick }: Props) {
  const { users, filterStatus, filterType, filterUserId, filterDateFrom, filterDateTo, filterText, setFilterStatus, setFilterType, setFilterUserId, setFilterDateFrom, setFilterDateTo, setFilterText } = useApp()

  const isStatusFiltered = filterStatus !== 'ALL'
  const isTypeFiltered = filterType !== 'ALL'
  const isUserFiltered = filterUserId !== 'ALL'

  return (
    <div className="flex items-center justify-between w-full gap-3">

      {/* Left: freetext search */}
      <div
        className="flex items-center gap-2 px-3 rounded-lg border"
        style={{ height: 34, borderColor: filterText ? '#111827' : '#e5e7eb', background: '#fff', minWidth: 220 }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Sök ärenden..."
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          className="text-sm bg-transparent outline-none flex-1"
          style={{ color: '#111827' }}
        />
        {filterText && (
          <button onClick={() => setFilterText('')} className="text-gray-400 hover:text-gray-600">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Right: dropdown filters */}
      <div className="flex items-center gap-2">
        <select
          className="filter-select"
          style={isStatusFiltered ? {
            borderColor: STATUS_CONFIG[filterStatus as WorkItemStatus].color,
            color: STATUS_CONFIG[filterStatus as WorkItemStatus].color,
            background: STATUS_CONFIG[filterStatus as WorkItemStatus].bg,
          } : {}}
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as WorkItemStatus | 'ALL')}
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <select
          className="filter-select"
          style={isTypeFiltered ? {
            borderColor: TYPE_CONFIG[filterType as WorkItemType].color,
            color: TYPE_CONFIG[filterType as WorkItemType].color,
            background: `${TYPE_CONFIG[filterType as WorkItemType].color}18`,
          } : {}}
          value={filterType}
          onChange={e => setFilterType(e.target.value as WorkItemType | 'ALL')}
        >
          {TYPE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <select
          className="filter-select"
          style={isUserFiltered ? { borderColor: '#6366f1', color: '#6366f1', background: '#eef2ff' } : {}}
          value={filterUserId}
          onChange={e => setFilterUserId(e.target.value)}
        >
          <option value="ALL">Alla personer</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>

        <DateRangeFilter
          from={filterDateFrom}
          to={filterDateTo}
          onFrom={setFilterDateFrom}
          onTo={setFilterDateTo}
        />
      </div>
    </div>
  )
}
