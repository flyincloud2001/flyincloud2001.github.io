import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { key: 'about',    path: '/' },
  { key: 'projects', path: '/notes' },
  { key: 'notes',    path: '/book-reviews' },
  { key: 'photos',   path: '/photos' },
  { key: 'contact',  path: '/contact' },
]

export default function Navbar() {
  const { t, toggleLang }                  = useLang()
  const { user, isAdmin, signIn, signOut } = useAuth()
  const navigate    = useNavigate()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Close dropdown on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  const handleNav = path => { navigate(path); setMenuOpen(false) }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.25rem',
        height: '60px',
        background: 'none',
      }}>
        <div style={{ flex: 1 }} />

        {/* Desktop nav items */}
        {!isMobile && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginRight: '1.25rem' }}>
              {NAV_ITEMS.map(({ key, path }) => {
                const active = pathname === path || (path !== '/' && pathname.startsWith(path))
                return (
                  <button
                    key={key}
                    onClick={() => navigate(path)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: active ? '#fff' : 'rgba(210,218,240,0.65)',
                      fontSize: '0.88rem', fontWeight: active ? 600 : 400,
                      letterSpacing: '0.02em', padding: '6px 10px', borderRadius: '6px',
                      transition: 'color 0.18s', textShadow: '0 1px 6px rgba(0,0,0,0.6)',
                    }}
                  >
                    {t('nav', key)}
                  </button>
                )
              })}
            </div>
            <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.12)', marginRight: '1.25rem' }} />
          </>
        )}

        {/* Right controls: lang toggle + auth + hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            onClick={toggleLang}
            style={{
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '6px', color: '#fff', cursor: 'pointer',
              fontSize: '0.78rem', fontWeight: 700, padding: '4px 10px', letterSpacing: '0.06em',
            }}
          >
            {t('nav', 'langSwitch')}
          </button>

          {user ? (
            <>
              {isAdmin && !isMobile && (
                <button onClick={() => navigate('/admin')} style={pill('#2563eb')}>
                  {t('nav', 'admin')}
                </button>
              )}
              <button onClick={signOut} style={pill('rgba(255,255,255,0.1)')}>
                {t('nav', 'logout')}
              </button>
            </>
          ) : (
            <button onClick={signIn} style={pill('rgba(255,255,255,0.1)')}>
              {t('nav', 'login')}
            </button>
          )}

          {/* Hamburger (mobile only) */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '6px', display: 'flex', flexDirection: 'column',
                justifyContent: 'center', gap: '5px',
              }}
            >
              <span style={burgerLine} />
              <span style={burgerLine} />
              <span style={burgerLine} />
            </button>
          )}
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {isMobile && menuOpen && (
        <div style={{
          position: 'fixed', top: '60px', left: 0, right: 0, zIndex: 99,
          background: 'rgba(10,14,30,0.97)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', flexDirection: 'column', padding: '0.5rem 0',
        }}>
          {NAV_ITEMS.map(({ key, path }) => {
            const active = pathname === path || (path !== '/' && pathname.startsWith(path))
            return (
              <button
                key={key}
                onClick={() => handleNav(path)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: active ? '#fff' : 'rgba(210,218,240,0.8)',
                  fontSize: '1rem', fontWeight: active ? 600 : 400,
                  padding: '0.75rem 1.5rem', textAlign: 'left',
                  transition: 'color 0.18s',
                }}
              >
                {t('nav', key)}
              </button>
            )
          })}
          {isAdmin && (
            <button
              onClick={() => handleNav('/admin')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#60a5fa', fontSize: '1rem',
                padding: '0.75rem 1.5rem', textAlign: 'left',
              }}
            >
              {t('nav', 'admin')}
            </button>
          )}
        </div>
      )}
    </>
  )
}

const pill = bg => ({
  background: bg,
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: '6px', color: '#fff', cursor: 'pointer',
  fontSize: '0.78rem', padding: '5px 11px',
  transition: 'opacity 0.18s',
})

const burgerLine = {
  display: 'block',
  width: '22px',
  height: '2px',
  background: 'rgba(210,218,240,0.85)',
  borderRadius: '2px',
}
