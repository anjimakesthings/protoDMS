import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import CalendarListView from './pages/CalendarListView'
import logo from './assets/logo_white_payoff_1_e7fc6ae3ea.svg'
import type { UserRole } from './types'
import { USER_ROLE_CONFIG } from './types'

function SimulatedUserControls() {
  const { users, simulatedUserId, simulatedRole, setSimulatedUserId, setSimulatedRole } = useApp()
  return (
    <>
      <span className="text-sm text-gray-400">Visa som</span>
      <select
        value={simulatedUserId ?? 'ADMIN'}
        onChange={e => setSimulatedUserId(e.target.value === 'ADMIN' ? null : e.target.value)}
        className="text-sm border border-gray-600 rounded px-2 py-1 bg-gray-800 text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-500"
      >
        <option value="ADMIN">Administratör</option>
        {users.map(u => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </select>
      {simulatedUserId !== null && (
        <select
          value={simulatedRole}
          onChange={e => setSimulatedRole(e.target.value as UserRole)}
          className="text-sm border border-gray-600 rounded px-2 py-1 bg-gray-800 text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-500"
        >
          {(['READ_CREATE', 'READ_ONLY'] as UserRole[]).map(role => (
            <option key={role} value={role}>{USER_ROLE_CONFIG[role].label}</option>
          ))}
        </select>
      )}
    </>
  )
}


export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex flex-col w-full min-h-screen bg-white">
          {/* Top navbar */}
          <nav className="w-full flex-shrink-0 px-6 py-6 flex items-center bg-gray-900">
            <img src={logo} alt="place2place" style={{ height: 48 }} />
            <div className="ml-auto flex items-center gap-2">
              <SimulatedUserControls />
            </div>
          </nav>


          <div className="flex flex-1 flex-col w-full bg-white">
            <Routes>
              <Route path="/ordrar" element={<div />} />
              <Route path="/" element={<CalendarListView />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}
