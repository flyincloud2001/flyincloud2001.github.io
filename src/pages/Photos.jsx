import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useLang } from '../context/LangContext'

export default function Photos() {
  const { t, lang }   = useLang()
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
              <div key={p.id} style={{ cursor: 'pointer' }} onClick={() => setLightbox(p)}>
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
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out',
          }}
        >
          <img
            src={lightbox.url} alt=""
            style={{ maxWidth: '92vw', maxHeight: '90vh', borderRadius: '8px', objectFit: 'contain' }}
          />
        </div>
      )}
    </div>
  )
}

const h2    = { fontSize: '1.6rem', fontWeight: 700, color: '#fff', margin: '0 0 1.5rem' }
const empty = { color: 'rgba(200,205,225,0.6)', fontStyle: 'italic' }
