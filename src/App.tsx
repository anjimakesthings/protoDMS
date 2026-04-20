import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import CalendarListView from './pages/CalendarListView'
import logo from './assets/logo_white_payoff_1_e7fc6ae3ea.svg'
import type { UserRole } from './types'
import { USER_ROLE_CONFIG } from './types'

function SecondaryNav() {
  const { users, simulatedUserId, simulatedRole, setSimulatedUserId, setSimulatedRole } = useApp()

  return (
    <div className="w-full flex-shrink-0" style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
      <div className="flex items-center px-6" style={{ height: 48 }}>
        {/* Left: tab links */}
        <div className="flex items-center gap-1">
          <NavLink
            to="/ordrar"
            className={({ isActive }) =>
              [
                'px-3 py-1 text-sm rounded',
                isActive
                  ? 'font-medium text-gray-800 border border-gray-300 bg-white'
                  : 'text-gray-500 hover:text-gray-700',
              ].join(' ')
            }
          >
            Ordrar
          </NavLink>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              [
                'px-3 py-1 text-sm rounded',
                isActive
                  ? 'font-medium text-gray-800 border border-gray-300 bg-white'
                  : 'text-gray-500 hover:text-gray-700',
              ].join(' ')
            }
          >
            Ärendehantering
          </NavLink>
        </div>

        {/* Right: Visa som controls */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-gray-500">Visa som</span>
          <select
            value={simulatedUserId ?? 'ADMIN'}
            onChange={e => setSimulatedUserId(e.target.value === 'ADMIN' ? null : e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400"
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
              className="text-sm border border-gray-300 rounded px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400"
            >
              {(['READ_CREATE', 'READ_ONLY'] as UserRole[]).map(role => (
                <option key={role} value={role}>{USER_ROLE_CONFIG[role].label}</option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex flex-col w-full min-h-screen" style={{ background: '#ffffff' }}>
          {/* Top navbar */}
          <nav className="w-full flex-shrink-0 px-6 py-6 flex justify-center" style={{ background: '#111827' }}>
            <img src={logo} alt="place2place" style={{ height: 48 }} />
          </nav>

          {/* Secondary tab nav */}
          <SecondaryNav />

          <div className="flex flex-1 justify-center" style={{ background: '#ffffff' }}>
            <div className="flex flex-col w-full max-w-7xl">
              <Routes>
                <Route path="/ordrar" element={<div />} />
                <Route path="/" element={<CalendarListView />} />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}
