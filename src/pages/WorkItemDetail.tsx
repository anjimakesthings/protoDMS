import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { WorkItemStatus, WorkItemType } from '../types'
import { STATUS_CONFIG, TYPE_CONFIG, isOrderNumber } from '../types'
import { useApp } from '../context/AppContext'
import StatusBadge from '../components/StatusBadge'

function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('sv-SE', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso))
}

function toDateInputValue(iso: string | null): string {
  if (!iso) return ''
  return iso.slice(0, 10)
}

export default function WorkItemDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { workItems, users, updateWorkItem, deleteWorkItem, addAction, toggleAction, removeAction } = useApp()

  const item = workItems.find(i => i.id === id)

  const [title, setTitle] = useState(item?.title ?? '')
  const [description, setDescription] = useState(item?.description ?? '')
  const [type, setType] = useState<WorkItemType>(item?.type ?? 'TRANSPORT')
  const [status, setStatus] = useState<WorkItemStatus>(item?.status ?? 'CREATED')
  const [reference, setReference] = useState(item?.reference ?? '')
  const [referenceEditing, setReferenceEditing] = useState(!item?.reference)
  const referenceInputRef = useRef<HTMLInputElement>(null)
  const [assignedToUserId, setAssignedToUserId] = useState(item?.assignedToUserId ?? '')
  const [scheduledDate, setScheduledDate] = useState(toDateInputValue(item?.scheduledDate ?? null))
  const [pickupAddress, setPickupAddress] = useState(item?.transport?.pickupAddress ?? '')
  const [deliveryAddress, setDeliveryAddress] = useState(item?.transport?.deliveryAddress ?? '')
  const [transportType, setTransportType] = useState(item?.transport?.transportType ?? '')
  const [newActionText, setNewActionText] = useState('')
  const [saved, setSaved] = useState(false)

  if (!item) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <div className="text-5xl mb-3">🔍</div>
          <p className="font-semibold">Ärendet hittades inte</p>
          <button className="btn-primary mt-4" onClick={() => navigate('/')}>Tillbaka</button>
        </div>
      </div>
    )
  }

  const assignedUser = assignedToUserId ? users.find(u => u.id === assignedToUserId) : null
  const completedActions = item.actions.filter(a => a.completed).length

  function handleSave() {
    updateWorkItem(item!.id, {
      title: title.trim(),
      description,
      type,
      status,
      reference: reference.trim() || null,
      assignedToUserId: assignedToUserId || null,
      scheduledDate: scheduledDate ? new Date(scheduledDate).toISOString() : null,
      transport: type === 'TRANSPORT' ? { pickupAddress, deliveryAddress, transportType } : undefined,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleDelete() {
    if (confirm(`Ta bort ärendet "${item!.title}" permanent?`)) {
      deleteWorkItem(item!.id)
      navigate('/')
    }
  }

  function handleCancel() {
    if (item!.status !== 'CANCELLED' && confirm(`Avbryt ärendet "${item!.title}"?`)) {
      updateWorkItem(item!.id, { status: 'CANCELLED' })
      setStatus('CANCELLED')
    }
  }

  function handleAddAction() {
    if (!newActionText.trim()) return
    addAction(item!.id, newActionText.trim())
    setNewActionText('')
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Alla ärenden
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-semibold text-gray-700 truncate max-w-xs">{item.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-mono">{item.id}</span>
          <StatusBadge status={status} />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6" style={{ background: '#f7f8fa' }}>
        <div className="max-w-3xl mx-auto space-y-5">

          {/* Action bar */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 leading-snug">{item.title}</h2>
            <div className="flex items-center gap-2">
              {item.status !== 'CANCELLED' && item.status !== 'COMPLETED' && (
                <button className="btn-secondary text-xs py-1.5 px-3" onClick={handleCancel}>
                  Avbryt ärende
                </button>
              )}
              <button className="btn-danger text-xs py-1.5 px-3" onClick={handleDelete}>
                Ta bort
              </button>
            </div>
          </div>

          {/* Main form card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h3 className="text-sm font-bold text-gray-700 border-b border-gray-100 pb-3">Ärendedetaljer</h3>

            <div>
              <label className="modal-field-label">Titel</label>
              <input className="modal-input" value={title} onChange={e => setTitle(e.target.value)} />
            </div>

            <div>
              <label className="modal-field-label">Beskrivning</label>
              <textarea
                className="modal-input"
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Referens */}
            <div>
              <label className="modal-field-label">
                Referens
                <span className="ml-1.5 text-xs font-normal text-gray-400">ordernummer eller fritext</span>
              </label>
              {referenceEditing ? (
                <div className="relative">
                  <input
                    ref={referenceInputRef}
                    className="modal-input pr-24"
                    placeholder="Ordernummer (6–8 siffror) eller fritext..."
                    value={reference}
                    onChange={e => setReference(e.target.value)}
                    onBlur={() => { if (reference.trim()) setReferenceEditing(false) }}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (reference.trim()) setReferenceEditing(false) } }}
                    autoFocus
                  />
                  {reference.trim() && (
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold pointer-events-none"
                      style={{ color: isOrderNumber(reference) ? '#10b981' : '#94a3b8' }}
                    >
                      {isOrderNumber(reference) ? 'Ordernr ✓' : 'Fritext'}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50" style={{ minHeight: 38 }}>
                  {isOrderNumber(reference) ? (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                      <button
                        className="text-sm font-semibold hover:underline flex-1 text-left"
                        style={{ color: '#0ea5e9' }}
                        onClick={() => navigate(`/orders/${reference}`)}
                        title={`Öppna order ${reference}`}
                      >
                        Order #{reference}
                      </button>
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0">
                        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                        <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                      </svg>
                      <span className="text-sm text-gray-700 flex-1">{reference}</span>
                    </>
                  )}
                  <button
                    onClick={() => { setReferenceEditing(true); setTimeout(() => referenceInputRef.current?.focus(), 0) }}
                    className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors flex-shrink-0"
                    title="Redigera referens"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="modal-field-label">Typ</label>
                <select className="modal-input" value={type} onChange={e => setType(e.target.value as WorkItemType)}>
                  {(Object.keys(TYPE_CONFIG) as WorkItemType[]).map(t => (
                    <option key={t} value={t}>{TYPE_CONFIG[t].icon} {TYPE_CONFIG[t].label}</option>
                  ))}
                </select>
              </div>
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
                  <StatusBadge status={status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="modal-field-label">Tilldelad</label>
                <select
                  className="modal-input"
                  value={assignedToUserId}
                  onChange={e => setAssignedToUserId(e.target.value)}
                >
                  <option value="">Ej tilldelad</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
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
                    onChange={e => setScheduledDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Assigned user display */}
            {assignedUser && (
              <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: '#f8fafc' }}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: STATUS_CONFIG[status].color }}
                >
                  {assignedUser.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700">{assignedUser.name}</div>
                  <div className="text-xs text-gray-400">Tilldelad handläggare</div>
                </div>
              </div>
            )}
          </div>

          {/* Transport card */}
          {type === 'TRANSPORT' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a5568" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <h3 className="text-sm font-bold text-gray-700">Transportinformation</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="modal-field-label">Hämtadress</label>
                  <input className="modal-input" value={pickupAddress} onChange={e => setPickupAddress(e.target.value)} />
                </div>
                <div>
                  <label className="modal-field-label">Leveransadress</label>
                  <input className="modal-input" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} />
                </div>
                <div>
                  <label className="modal-field-label">Transporttyp</label>
                  <input className="modal-input" value={transportType} onChange={e => setTransportType(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Åtgärder card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-700">Åtgärder</h3>
              {item.actions.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-24 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(completedActions / item.actions.length) * 100}%`,
                        background: STATUS_CONFIG[status].color,
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{completedActions}/{item.actions.length}</span>
                </div>
              )}
            </div>

            <div className="space-y-0.5 mb-3">
              {item.actions.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">Inga åtgärder tillagda</p>
              ) : (
                item.actions.map(action => (
                  <div
                    key={action.id}
                    className={`action-item px-2 rounded-lg hover:bg-gray-50 ${action.completed ? 'completed' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={action.completed}
                      onChange={() => toggleAction(item.id, action.id)}
                    />
                    <span className="flex-1 text-sm text-gray-700">{action.text}</span>
                    <button
                      onClick={() => removeAction(item.id, action.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors"
                      title="Ta bort"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add action */}
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <input
                className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-yellow-400 transition-colors placeholder-gray-400"
                placeholder="+ Lägg till åtgärd..."
                value={newActionText}
                onChange={e => setNewActionText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddAction()}
              />
              <button
                className="btn-primary py-2 px-3 text-xs"
                onClick={handleAddAction}
                disabled={!newActionText.trim()}
                style={{ opacity: newActionText.trim() ? 1 : 0.4 }}
              >
                Lägg till
              </button>
            </div>
          </div>

          {/* Historik card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-bold text-gray-700 mb-4">Historik</h3>
            <div className="relative">
              {item.events.map((ev, i) => (
                <div key={i} className="flex gap-3 pb-4 last:pb-0">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5"
                      style={{ background: i === 0 ? '#fec301' : '#cbd5e0' }}
                    />
                    {i < item.events.length - 1 && (
                      <div className="w-px flex-1 bg-gray-200 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-gray-700">{ev.type}</span>
                      {ev.detail && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{
                            background: ev.detail in STATUS_CONFIG
                              ? STATUS_CONFIG[ev.detail as WorkItemStatus].bg
                              : '#f1f5f9',
                            color: ev.detail in STATUS_CONFIG
                              ? STATUS_CONFIG[ev.detail as WorkItemStatus].color
                              : '#64748b',
                          }}
                        >
                          {ev.detail in STATUS_CONFIG
                            ? STATUS_CONFIG[ev.detail as WorkItemStatus].label
                            : ev.detail}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{formatDateTime(ev.timestamp)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Meta info */}
          <div className="text-xs text-gray-400 flex items-center gap-4">
            <span>Skapat: {formatDateTime(item.createdAt)}</span>
            <span>Uppdaterat: {formatDateTime(item.updatedAt)}</span>
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200 flex-shrink-0">
        <button className="btn-secondary" onClick={() => navigate('/')}>
          Avbryt
        </button>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Sparad
            </span>
          )}
          <button className="btn-primary" onClick={handleSave}>
            Spara ändringar
          </button>
        </div>
      </div>
    </div>
  )
}
