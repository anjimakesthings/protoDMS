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
  assignedToUserId: string | null
  scheduledDate: string | null
  transport?: WorkItemTransport
  actions: WorkItemAction[]
  events: WorkItemEvent[]
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  initials: string
}

export const STATUS_CONFIG: Record<WorkItemStatus, { label: string; color: string; bg: string }> = {
  CREATED:     { label: 'Skapad',   color: '#3b82f6', bg: '#eff6ff' },
  PLANNED:     { label: 'Planerad', color: '#8b5cf6', bg: '#f5f3ff' },
  IN_PROGRESS: { label: 'Pågående', color: '#f59e0b', bg: '#fffbeb' },
  COMPLETED:   { label: 'Avslutad', color: '#10b981', bg: '#ecfdf5' },
  CANCELLED:   { label: 'Avbruten', color: '#ef4444', bg: '#fef2f2' },
}

export const TYPE_CONFIG: Record<WorkItemType, { label: string; icon: string; color: string }> = {
  TRANSPORT: { label: 'Transport', icon: '🚛', color: '#0ea5e9' },
  GENERAL:   { label: 'Generellt', icon: '⚙️', color: '#64748b' },
}
