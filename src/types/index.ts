export type WorkItemStatus = 'CREATED' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
export type WorkItemType = 'TRANSPORT' | 'GENERAL'

export interface WorkItemTransport {
  pickupAddress: string
  deliveryAddress: string
  transportType: string
}

export interface WorkItemAction {
  id: string
  text: string
  completed: boolean
}

export interface WorkItemEvent {
  type: string
  timestamp: string
  detail?: string
}

export interface WorkItem {
  id: string
  type: WorkItemType
  status: WorkItemStatus
  title: string
  description: string
  reference: string | null   // order number (6-8 digits) or free text
  assignedToUserIds: string[]
  scheduledDate: string | null
  transport?: WorkItemTransport
  actions: WorkItemAction[]
  events: WorkItemEvent[]
  createdAt: string
  updatedAt: string
}

/** Returns true if the value is a valid order number (6-8 digits only) */
export function isOrderNumber(value: string): boolean {
  return /^\d{6,8}$/.test(value.trim())
}

export interface User {
  id: string
  name: string
  initials: string
}

export const STATUS_CONFIG: Record<WorkItemStatus, { label: string; color: string; bg: string }> = {
  CREATED:     { label: 'Skapad',   color: '#166534', bg: '#dcfce7' },
  PLANNED:     { label: 'Planerad', color: '#7c3aed', bg: '#ede9fe' },
  IN_PROGRESS: { label: 'Pågående', color: '#c2410c', bg: '#fed7aa' },  // soft peach/salmon — matches screenshot 2
  COMPLETED:   { label: 'Avslutad', color: '#374151', bg: '#f3f4f6' },
  CANCELLED:   { label: 'Avbruten', color: '#991b1b', bg: '#fee2e2' },
}

export const TYPE_CONFIG: Record<WorkItemType, { label: string; icon: string; color: string }> = {
  TRANSPORT: { label: 'Transport', icon: '🚛', color: '#0ea5e9' },
  GENERAL:   { label: 'Generellt', icon: '⚙️', color: '#64748b' },
}
