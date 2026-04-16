import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import type { WorkItem, WorkItemStatus, WorkItemType } from '../types'
import { STATUS_CONFIG, isOrderNumber } from '../types'
import { useApp } from '../context/AppContext'
import StatusBadge from './StatusBadge'

type ModalMode = 'create' | 'edit' | 'view'

interface Props {
  item: WorkItem | null      // null = create mode
  initialDate?: string | null
  initialMode?: ModalMode
  onClose: () => void
}

function formatViewDate(iso: string): string {
  return new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))
}

function formatEventTime(iso: string): string {
  return new Intl.DateTimeFormat('sv-SE', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

function toDateInputValue(iso: string | null): string {
  if (!iso) return ''
  return iso.slice(0, 10)
}

// ─── Smart Reference Field ────────────────────────────────────────────────────
interface ReferenceFieldProps {
  value: string
  onChange: (v: string) => void
}

function ReferenceField({ value, onChange }: ReferenceFieldProps) {
  const navigate = useNavigate()
  const [editing, setEditing] = useState(!value)  // start in edit mode if empty
  const inputRef = useRef<HTMLInputElement>(null)

  const isOrder = isOrderNumber(value)

  function handleBlur() {
    // Only lock if there's actually a value
    if (value.trim()) setEditing(false)
  }

  function startEditing() {
    setEditing(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  if (editing) {
    return (
      <div className="relative">
        <input
          ref={inputRef}
          className="modal-input pr-10"
          placeholder="Ordernummer (6–8 siffror) eller fritext..."
          value={value}
          onChange={e => onChange(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (value.trim()) setEditing(false) } }}
          autoFocus={!!value}
        />
        {value.trim() && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold"
            style={{ color: isOrderNumber(value) ? '#10b981' : '#94a3b8', pointerEvents: 'none' }}
          >
            {isOrderNumber(value) ? 'Ordernr ✓' : 'Fritext'}
          </span>
        )}
      </div>
    )
  }

  // Locked / display mode
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50"
      style={{ minHeight: 38 }}
    >
      {isOrder ? (
        <>
          {/* Order number link */}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <button
            className="text-sm font-semibold hover:underline flex-1 text-left"
            style={{ color: '#0ea5e9' }}
            onClick={() => navigate(`/orders/${value}`)}
            title={`Öppna order ${value}`}
          >
            Order #{value}
          </button>
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          <span className="text-sm text-gray-700 flex-1">{value}</span>
        </>
      )}
      {/* Edit pen — only shown for valid order numbers per spec; always shown for any saved value */}
      <button
        onClick={startEditing}
        className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors flex-shrink-0"
        title="Redigera referens"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>
    </div>
  )
}
// ─────────────────────────────────────────────────────────────────────────────

export default function WorkItemModal({ item, initialDate, initialMode, onClose }: Props) {
  const { users, createWorkItem, updateWorkItem } = useApp()
  const isEdit = item !== null
  const overlayRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<ModalMode>(initialMode ?? (item ? 'edit' : 'create'))

  // Form state — Transport is the default type for new items
  const [title, setTitle] = useState(item?.title ?? '')
  const [description, setDescription] = useState(item?.description ?? '')
  const type: WorkItemType = 'TRANSPORT'
  const [status, setStatus] = useState<WorkItemStatus>(item?.status ?? 'CREATED')
  const [reference, setReference] = useState(item?.reference ?? '')
  const [assignedToUserIds, setAssignedToUserIds] = useState<string[]>(item?.assignedToUserIds ?? [])
  const [scheduledDate, setScheduledDate] = useState(toDateInputValue(item?.scheduledDate ?? initialDate ?? null))
  const [pickupAddress, setPickupAddress] = useState(item?.transport?.pickupAddress ?? '')
  const [deliveryAddress, setDeliveryAddress] = useState(item?.transport?.deliveryAddress ?? '')
  const [transportType, setTransportType] = useState(item?.transport?.transportType ?? '')
  const [cancellationComment, setCancellationComment] = useState(item?.cancellationComment ?? '')

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  function handleSave() {
    if (!title.trim()) return alert('Titel krävs')

    const data = {
      title: title.trim(),
      description,
      type,
      status,
      reference: reference.trim() || null,
      assignedToUserIds,
      scheduledDate: scheduledDate ? new Date(scheduledDate).toISOString() : null,
      transport: { pickupAddress, deliveryAddress, transportType },
      actions: isEdit ? item!.actions : [],
      cancellationComment: status === 'CANCELLED' ? cancellationComment.trim() || undefined : undefined,
    }

    if (isEdit) {
      updateWorkItem(item!.id, data)
    } else {
      createWorkItem(data)
    }
    onClose()
  }

  return (
    <div className="modal-overlay" ref={overlayRef}>
      {/* Backdrop */}
      <div className="modal-backdrop" onClick={onClose} />

      {/* Dialog */}
      <div className="modal-dialog">
        {/* Header */}
        <div className="modal-header">
          <h2 className="text-base font-bold text-gray-900">
            {mode === 'view' ? item!.title : mode === 'edit' ? 'Redigera ärende' : 'Skapa nytt ärende'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Stäng"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
        {mode === 'view' && item ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <StatusBadge status={item.status} />
              {item.scheduledDate && (
                <span className="text-sm text-gray-500">{formatViewDate(item.scheduledDate)}</span>
              )}
            </div>
            {users.filter(u => item.assignedToUserIds.includes(u.id)).length > 0 && (
              <div>
                <div className="modal-field-label">Tilldelad</div>
                <div className="text-sm text-gray-800">
                  {users.filter(u => item.assignedToUserIds.includes(u.id)).map(u => u.name).join(', ')}
                </div>
              </div>
            )}
            {item.reference && (
              <div>
                <div className="modal-field-label">Referens</div>
                {isOrderNumber(item.reference) ? (
                  <a
                    href={`/orders/${item.reference}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
                    style={{ color: '#0ea5e9' }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    Order #{item.reference}
                  </a>
                ) : (
                  <div className="text-sm text-gray-800">{item.reference}</div>
                )}
              </div>
            )}
            {(item.transport?.pickupAddress || item.transport?.deliveryAddress || item.transport?.transportType) && (
              <div className="transport-section">
                <div className="text-xs font-bold text-gray-500 mb-2">Transportinformation</div>
                {item.transport?.pickupAddress && (
                  <div className="mb-1">
                    <span className="modal-field-label">Hämtadress</span>
                    <div className="text-sm text-gray-800">{item.transport.pickupAddress}</div>
                  </div>
                )}
                {item.transport?.deliveryAddress && (
                  <div className="mb-1">
                    <span className="modal-field-label">Leveransadress</span>
                    <div className="text-sm text-gray-800">{item.transport.deliveryAddress}</div>
                  </div>
                )}
                {item.transport?.transportType && (
                  <div>
                    <span className="modal-field-label">Transporttyp</span>
                    <div className="text-sm text-gray-800">{item.transport.transportType}</div>
                  </div>
                )}
              </div>
            )}
            {item.cancellationComment && (
              <div className="rounded-lg px-3 py-2.5" style={{ background: '#fee2e2', border: '1px solid #fecaca' }}>
                <div className="modal-field-label" style={{ color: '#991b1b' }}>Avbokningskommentar</div>
                <div className="text-sm whitespace-pre-wrap" style={{ color: '#7f1d1d' }}>{item.cancellationComment}</div>
              </div>
            )}
            {item.description && (
              <div>
                <div className="modal-field-label">Beskrivning</div>
                <div className="text-sm text-gray-800 whitespace-pre-wrap">{item.description}</div>
              </div>
            )}
          </div>
        ) : (<>
          {/* 1. Titel */}
          <div className="mb-4">
            <label className="modal-field-label">Titel <span className="text-red-500">*</span></label>
            <input
              className="modal-input"
              placeholder="Ärendets titel..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          {/* 2. Utförandedatum */}
          <div className="mb-4">
            <div>
              <label className="modal-field-label">Utförandedatum</label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </span>
                <input
                  type="date"
                  className="modal-input"
                  style={{ paddingLeft: 32 }}
                  value={scheduledDate}
                  onChange={e => {
                    setScheduledDate(e.target.value)
                    if (e.target.value) setStatus('PLANNED')
                  }}
                />
              </div>
            </div>
          </div>

          {/* Referens */}
          <div className="mb-4">
            <label className="modal-field-label">
              Referens
              <span className="ml-1.5 text-xs font-normal text-gray-400">ordernummer eller fritext</span>
            </label>
            <ReferenceField value={reference} onChange={setReference} />
          </div>

          {/* Status + Tilldelad */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="modal-field-label">Status</label>
              <div className="flex items-center gap-2">
                <select
                  className="modal-input flex-1"
                  value={status}
                  onChange={e => setStatus(e.target.value as WorkItemStatus)}
                >
                  {(Object.keys(STATUS_CONFIG) as WorkItemStatus[]).map(s => (
                    <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="modal-field-label">Tilldelad</label>
              <div className="flex flex-col gap-2">
                {(assignedToUserIds.length === 0 ? [''] : assignedToUserIds).map((uid, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <select
                      className="modal-input flex-1"
                      value={uid}
                      onChange={e => {
                        const next = [...assignedToUserIds]
                        if (e.target.value === '') next.splice(i, 1)
                        else next[i] = e.target.value
                        setAssignedToUserIds(next)
                      }}
                    >
                      <option value="">Ej tilldelad</option>
                      {users
                        .filter(u => u.id === uid || !assignedToUserIds.includes(u.id))
                        .map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                    {assignedToUserIds.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setAssignedToUserIds(assignedToUserIds.filter((_, idx) => idx !== i))}
                        className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                        title="Ta bort"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                {assignedToUserIds.length < users.length && assignedToUserIds.every(id => id !== '') && (
                  <button
                    type="button"
                    onClick={() => setAssignedToUserIds([...assignedToUserIds, users.find(u => !assignedToUserIds.includes(u.id))!.id])}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors w-fit"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Lägg till person
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Cancellation comment */}
          {status === 'CANCELLED' && (
            <div className="mb-4">
              <label className="modal-field-label">
                Avbokningskommentar <span className="text-red-500">*</span>
              </label>
              <textarea
                className="modal-input"
                rows={2}
                placeholder="Beskriv varför ärendet avbokades..."
                value={cancellationComment}
                onChange={e => setCancellationComment(e.target.value)}
                style={{ resize: 'vertical' }}
                autoFocus
              />
            </div>
          )}

          {/* Transport section */}
          <div className="transport-section mb-4">
              <div className="flex items-center gap-1.5 mb-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a5568" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-sm font-bold text-gray-600">Transportinformation</span>
              </div>
              <div className="mb-3">
                <label className="modal-field-label" style={{ fontSize: '0.75rem', color: '#64748b' }}>Hämtadress <span className="text-red-500">*</span></label>
                <input
                  className="modal-input"
                  placeholder="t.ex. Lagervägen 4, Stockholm"
                  value={pickupAddress}
                  onChange={e => setPickupAddress(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="modal-field-label" style={{ fontSize: '0.75rem', color: '#64748b' }}>Leveransadress <span className="text-red-500">*</span></label>
                <input
                  className="modal-input"
                  placeholder="t.ex. Strandvägen 12, Stockholm"
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                />
              </div>
              <div>
                <label className="modal-field-label" style={{ fontSize: '0.75rem', color: '#64748b' }}>Transporttyp <span className="text-red-500">*</span></label>
                <input
                  className="modal-input"
                  placeholder="t.ex. Lastbil, Skåpbil, Specialtransport"
                  value={transportType}
                  onChange={e => setTransportType(e.target.value)}
                />
              </div>
            </div>

          {/* Beskrivning */}
          <div className="mb-4">
            <label className="modal-field-label">Beskrivning</label>
            <textarea
              className="modal-input"
              rows={3}
              placeholder="Beskrivning av ärendet..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Historik */}
          {isEdit && item!.events.length > 0 && (
            <div>
              <label className="modal-field-label">Historik</label>
              <div className="space-y-0.5">
                {item!.events.map((ev, i) => (
                  <div key={i} className="historik-event">
                    <span className="he-time">{formatEventTime(ev.timestamp)}</span>
                    <span className="he-type">{ev.type}</span>
                    {ev.detail && <span className="he-detail text-gray-400">({ev.detail})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>)}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          {mode === 'view' ? (
            <>
              <button className="btn-secondary" onClick={onClose}>Avbryt</button>
              <button className="btn-primary flex items-center gap-1.5" onClick={() => setMode('edit')}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Redigera
              </button>
            </>
          ) : (
            <>
              <button className="btn-secondary" onClick={onClose}>Avbryt</button>
              <button className="btn-primary" onClick={handleSave}>Spara</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
