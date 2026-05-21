import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LangProvider }  from './context/LangContext'
import { AuthProvider }  from './context/AuthContext'
import Background        from './components/Background'
import Navbar            from './components/Navbar'
import ContentPanel      from './components/ContentPanel'
import About             from './pages/About'
import Projects          from './pages/Projects'
import Notes             from './pages/Notes'
import BookDetail        from './pages/BookDetail'
import Photos            from './pages/Photos'
import Contact           from './pages/Contact'
import Admin             from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter>
      <LangProvider>
        <AuthProvider>
          <Background />
          <Navbar />
          <ContentPanel>
            <Routes>
              <Route path="/"          element={<About />}      />
              <Route path="/projects"  element={<Projects />}   />
              <Route path="/notes"     element={<Notes />}      />
              <Route path="/notes/:id" element={<BookDetail />} />
              <Route path="/photos"    element={<Photos />}     />
              <Route path="/contact"   element={<Contact />}    />
              <Route path="/admin"     element={<Admin />}      />
            </Routes>
          </ContentPanel>
        </AuthProvider>
      </LangProvider>
    </BrowserRouter>
  )
}
