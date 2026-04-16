import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import CalendarListView from './pages/CalendarListView'
import logo from './assets/logo_white_payoff_1_e7fc6ae3ea.svg'

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
          <div className="w-full flex-shrink-0" style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
            <div className="flex items-center justify-center gap-1 px-4" style={{ height: 56 }}>
              <NavLink
                to="/ordrar"
                className={({ isActive }) =>
                  [
                    'px-3 py-1 text-base rounded',
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
                    'px-3 py-1 text-base rounded',
                    isActive
                      ? 'font-medium text-gray-800 border border-gray-300 bg-white'
                      : 'text-gray-500 hover:text-gray-700',
                  ].join(' ')
                }
              >
                Ärendehantering
              </NavLink>
            </div>
          </div>
          <div className="flex flex-1 justify-center" style={{ background: '#ffffff' }}>
          <div className="flex flex-col w-full" style={{ maxWidth: 1640 }}>
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
