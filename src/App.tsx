import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import CalendarListView from './pages/CalendarListView'
import WorkItemDetail from './pages/WorkItemDetail'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex flex-col w-full min-h-screen" style={{ background: '#faf8f5' }}>
          {/* Top navbar */}
          <nav className="w-full flex-shrink-0 px-6 py-6" style={{ background: '#111827' }}>
            <span className="text-xl font-semibold text-white">place2place</span>
          </nav>
          <div className="flex flex-1 justify-center" style={{ background: '#faf8f5' }}>
          <div className="flex flex-col w-full" style={{ maxWidth: 1440 }}>
            <Routes>
              <Route path="/" element={<CalendarListView />} />
              <Route path="/arenden/:id" element={<WorkItemDetail />} />
            </Routes>
          </div>
          </div>
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}
