import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useLang } from '../context/LangContext'

export default function Photos() {
  const { t }   = useLang()
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setPhotos(data ?? []); setLoading(false) })
  }, [])

  // ESC to close
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Prevent body scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightbox ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox])

  const open  = p => setLightbox(p)
  const close = () => setLightbox(null)

  return (
    <div style={{ padding: '0 clamp(1.25rem, 5vw, 2rem) 0 clamp(1.25rem, 5.3vw, 64px)' }}>
      <h2 style={h2}>{t('photos', 'title')}</h2>

      {loading ? <div style={{ color: 'rgba(200,205,225,0.45)' }}>…</div>
       : photos.length === 0 ? <p style={empty}>{t('photos', 'empty')}</p>
       : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: '0.75rem' }}>
          {photos.map(p => {
            const caption = p.caption || ''
            return (
              <div key={p.id} style={{ cursor: 'pointer' }} onClick={() => open(p)}>
                <img
                  src={p.url} alt={caption || ''}
                  style={{ width: '100%', height: '145px', objectFit: 'cover', borderRadius: '8px', display: 'block' }}
                  onError={e => { e.target.style.opacity = '0.3' }}
                />
                {caption && (
                  <p style={{ margin: '0.35rem 0 0', fontSize: '0.76rem', color: 'rgba(200,210,235,0.55)', textAlign: 'center' }}>
                    {caption}
                  </p>
                )}
              </div>
            )
          })}
        </div>
       )}

      {lightbox && (
        <div
          onClick={close}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          {/* Close button */}
          <button
            onClick={e => { e.stopPropagation(); close() }}
            style={{
              position: 'absolute', top: '1rem', right: '1rem',
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '50%',
              width: '44px', height: '44px',
              color: '#fff', fontSize: '1.3rem',
              cursor: 'pointer', zIndex: 201,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >✕</button>

          {/* Image */}
          <img
            src={lightbox.url} alt={lightbox.caption || ''}
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '92vw',
              maxHeight: lightbox.caption ? '80vh' : '88vh',
              borderRadius: '8px',
              objectFit: 'contain',
            }}
          />

          {/* Caption */}
          {lightbox.caption && (
            <p
              onClick={e => e.stopPropagation()}
              style={{
                marginTop: '0.85rem',
                color: 'rgba(255,255,255,0.7)',
                fontSize: 'clamp(0.8rem, 2.5vw, 0.95rem)',
                textAlign: 'center',
                padding: '0 1.5rem',
                maxWidth: '600px',
              }}
            >
              {lightbox.caption}
            </p>
          )}

          {/* Hint */}
          <p style={{
            position: 'absolute', bottom: '1rem',
            color: 'rgba(255,255,255,0.28)', fontSize: '0.75rem',
            margin: 0, pointerEvents: 'none',
          }}>
            點擊空白處或按 ESC 關閉
          </p>
        </div>
      )}
    </div>
  )
}

const h2    = { fontSize: '1.6rem', fontWeight: 700, color: '#fff', margin: '0 0 1.5rem' }
const empty = { color: 'rgba(200,205,225,0.6)', fontStyle: 'italic' }
