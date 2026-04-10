import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/Sidebar'
import CalendarListView from './pages/CalendarListView'
import WorkItemDetail from './pages/WorkItemDetail'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex h-screen overflow-hidden" style={{ background: '#f7f8fa' }}>
          <Sidebar />
          <main className="flex flex-col flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<CalendarListView />} />
              <Route path="/arenden/:id" element={<WorkItemDetail />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}
