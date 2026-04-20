export type WorkItemStatus = 'CREATED' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'INVOICED' | 'CANCELLED'
export type WorkItemType = 'TRANSPORT' | 'PICKUP'

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

export interface OrderProduct {
  id: string
  name: string
  description: string
  imageUrl: string
  thumbnailUrl?: string
  quantity: number
  unit?: string
}

export interface Order {
  orderNumber: string
  orderDate: string
  customerName: string
  customerEmail: string
  storageLocation: string
  products: OrderProduct[]
  pickupDate: string | null
  pickupStorageAddress: string
  deliveryAddress: string
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
  scheduledTimeFrom?: string   // HH:MM, undefined = hela dagen
  scheduledTimeTo?: string     // HH:MM
  transport?: WorkItemTransport
  actions: WorkItemAction[]
  events: WorkItemEvent[]
  cancellationComment?: string
  createdAt: string
  updatedAt: string
}

/** Returns true if the value is a valid order number (6-8 digits only) */
export function isOrderNumber(value: string): boolean {
  return /^\d{6,8}$/.test(value.trim())
}

export type UserRole = 'ADMIN' | 'READ_CREATE' | 'READ_ONLY'

export const USER_ROLE_CONFIG: Record<UserRole, { label: string }> = {
  ADMIN:       { label: 'Administratör' },
  READ_CREATE: { label: 'Läs & skapa' },
  READ_ONLY:   { label: 'Läsbehörighet' },
}

export interface User {
  id: string
  name: string
  initials: string
}

export const STATUS_CONFIG: Record<WorkItemStatus, { label: string; color: string; bg: string }> = {
  CREATED:     { label: 'Skapad',     color: '#166534', bg: '#dcfce7' },
  PLANNED:     { label: 'Schemalagd', color: '#7c3aed', bg: '#ede9fe' },
  IN_PROGRESS: { label: 'Pågående',   color: '#c2410c', bg: '#fed7aa' },
  COMPLETED:   { label: 'Slutförd',   color: '#374151', bg: '#f3f4f6' },
  INVOICED:    { label: 'Fakturerad', color: '#0369a1', bg: '#e0f2fe' },
  CANCELLED:   { label: 'Avbruten',   color: '#6b7280', bg: '#f3f4f6' },
}

export const TYPE_CONFIG: Record<WorkItemType, { label: string; icon: string; color: string }> = {
  TRANSPORT: { label: 'Leverans',    icon: '🚛', color: '#0ea5e9' },
  PICKUP:    { label: 'Upphämtning', icon: '📦', color: '#f59e0b' },
}
