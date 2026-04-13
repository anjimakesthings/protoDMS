import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import CalendarListView from './pages/CalendarListView'
import WorkItemDetail from './pages/WorkItemDetail'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#f4f5f7' }}>
          <Routes>
            <Route path="/" element={<CalendarListView />} />
            <Route path="/arenden/:id" element={<WorkItemDetail />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}
