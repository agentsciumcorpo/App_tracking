import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthGuard } from './components/layout/AuthGuard'
import { NavBar } from './components/layout/NavBar'
import { ProjectsProvider } from './contexts/ProjectsContext'
import { TimerPage } from './pages/TimerPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { HistoryPage } from './pages/HistoryPage'

function App() {
  return (
    <BrowserRouter>
      <AuthGuard>
        <ProjectsProvider>
          <div className="flex min-h-screen flex-col bg-zinc-900">
            <NavBar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<TimerPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
              </Routes>
            </main>
          </div>
        </ProjectsProvider>
      </AuthGuard>
    </BrowserRouter>
  )
}

export default App
