import React, { createContext, useContext, useState, useCallback } from 'react'
import type { WorkItem, WorkItemStatus, WorkItemType, User } from '../types'
import { MOCK_WORK_ITEMS, MOCK_USERS } from '../data/mockData'

interface AppState {
  workItems: WorkItem[]
  users: User[]
  filterStatus: WorkItemStatus | 'ALL'
  filterType: WorkItemType | 'ALL'
  filterUserId: string | 'ALL'
  filterDateFrom: string | null
  filterDateTo: string | null
  filterText: string
}

interface AppContextValue extends AppState {
  createWorkItem: (data: Omit<WorkItem, 'id' | 'createdAt' | 'updatedAt' | 'events'>) => WorkItem
  updateWorkItem: (id: string, data: Partial<WorkItem>) => void
  deleteWorkItem: (id: string) => void
  setFilterStatus: (status: WorkItemStatus | 'ALL') => void
  setFilterType: (type: WorkItemType | 'ALL') => void
  setFilterUserId: (userId: string | 'ALL') => void
  setFilterDateFrom: (date: string | null) => void
  setFilterDateTo: (date: string | null) => void
  setFilterText: (text: string) => void
  addAction: (workItemId: string, text: string) => void
  toggleAction: (workItemId: string, actionId: string) => void
  removeAction: (workItemId: string, actionId: string) => void
  filteredWorkItems: WorkItem[]
}

const AppContext = createContext<AppContextValue | null>(null)

let idCounter = MOCK_WORK_ITEMS.length + 1
let actionCounter = 100

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    workItems: MOCK_WORK_ITEMS,
    users: MOCK_USERS,
    filterStatus: 'ALL',
    filterType: 'ALL',
    filterUserId: 'ALL',
    filterDateFrom: null,
    filterDateTo: null,
    filterText: '',
  })

  const createWorkItem = useCallback((data: Omit<WorkItem, 'id' | 'createdAt' | 'updatedAt' | 'events'>): WorkItem => {
    const now = new Date().toISOString()
    const id = `WI-${String(idCounter++).padStart(3, '0')}`
    const item: WorkItem = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
      events: [{ type: 'WORKITEM_CREATED', timestamp: now }],
    }
    setState(s => ({ ...s, workItems: [...s.workItems, item] }))
    return item
  }, [])

  const updateWorkItem = useCallback((id: string, data: Partial<WorkItem>) => {
    setState(s => ({
      ...s,
      workItems: s.workItems.map(item => {
        if (item.id !== id) return item
        const now = new Date().toISOString()
        const updated = { ...item, ...data, updatedAt: now }
        if (data.status && data.status !== item.status) {
          updated.events = [
            ...item.events,
            { type: 'STATUS_CHANGED', timestamp: now, detail: data.status },
          ]
        }
        return updated
      }),
    }))
  }, [])

  const deleteWorkItem = useCallback((id: string) => {
    setState(s => ({ ...s, workItems: s.workItems.filter(i => i.id !== id) }))
  }, [])

  const setFilterStatus = useCallback((status: WorkItemStatus | 'ALL') => {
    setState(s => ({ ...s, filterStatus: status }))
  }, [])

  const setFilterType = useCallback((type: WorkItemType | 'ALL') => {
    setState(s => ({ ...s, filterType: type }))
  }, [])

  const setFilterUserId = useCallback((userId: string | 'ALL') => {
    setState(s => ({ ...s, filterUserId: userId }))
  }, [])

  const setFilterDateFrom = useCallback((date: string | null) => {
    setState(s => ({ ...s, filterDateFrom: date }))
  }, [])

  const setFilterDateTo = useCallback((date: string | null) => {
    setState(s => ({ ...s, filterDateTo: date }))
  }, [])

  const setFilterText = useCallback((text: string) => {
    setState(s => ({ ...s, filterText: text }))
  }, [])

  const addAction = useCallback((workItemId: string, text: string) => {
    setState(s => ({
      ...s,
      workItems: s.workItems.map(item => {
        if (item.id !== workItemId) return item
        return {
          ...item,
          actions: [...item.actions, { id: `A${actionCounter++}`, text, completed: false }],
          updatedAt: new Date().toISOString(),
        }
      }),
    }))
  }, [])

  const toggleAction = useCallback((workItemId: string, actionId: string) => {
    setState(s => ({
      ...s,
      workItems: s.workItems.map(item => {
        if (item.id !== workItemId) return item
        return {
          ...item,
          actions: item.actions.map(a =>
            a.id === actionId ? { ...a, completed: !a.completed } : a
          ),
          updatedAt: new Date().toISOString(),
        }
      }),
    }))
  }, [])

  const removeAction = useCallback((workItemId: string, actionId: string) => {
    setState(s => ({
      ...s,
      workItems: s.workItems.map(item => {
        if (item.id !== workItemId) return item
        return {
          ...item,
          actions: item.actions.filter(a => a.id !== actionId),
          updatedAt: new Date().toISOString(),
        }
      }),
    }))
  }, [])

  const filteredWorkItems = state.workItems.filter(item => {
    const statusMatch = state.filterStatus === 'ALL' || item.status === state.filterStatus
    const typeMatch = state.filterType === 'ALL' || item.type === state.filterType
    const userMatch = state.filterUserId === 'ALL' || item.assignedToUserId === state.filterUserId
    const dateStr = item.scheduledDate ? item.scheduledDate.slice(0, 10) : null
    const fromMatch = !state.filterDateFrom || (dateStr && dateStr >= state.filterDateFrom)
    const toMatch = !state.filterDateTo || (dateStr && dateStr <= state.filterDateTo)
    const needle = state.filterText.toLowerCase()
    const textMatch = !needle || item.title.toLowerCase().includes(needle) || (item.description ?? '').toLowerCase().includes(needle) || (item.reference ?? '').toLowerCase().includes(needle)
    return statusMatch && typeMatch && userMatch && fromMatch && toMatch && textMatch
  })

  return (
    <AppContext.Provider value={{
      ...state,
      filteredWorkItems,
      createWorkItem,
      updateWorkItem,
      deleteWorkItem,
      setFilterStatus,
      setFilterType,
      setFilterUserId,
      setFilterDateFrom,
      setFilterDateTo,
      setFilterText,
      addAction,
      toggleAction,
      removeAction,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
