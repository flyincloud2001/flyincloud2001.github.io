import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useLang } from '../context/LangContext'

export default function Notes() {
  const { t, lang } = useLang()
  const navigate    = useNavigate()
  const [books, setBooks]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('books')
      .select('id, title_zh, title_en, author_en, created_at')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setBooks(data ?? []); setLoading(false) })
  }, [])

  return (
    <div style={{ padding: '0 clamp(1.25rem, 5vw, 2rem) 0 clamp(1.25rem, 5.3vw, 64px)' }}>
      <h2 style={h2}>{t('notes', 'title')}</h2>
      <p style={{ color: 'rgba(200,210,235,0.55)', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
        {t('notes', 'subtitle')}
      </p>

      {loading ? <div style={{ color: 'rgba(200,205,225,0.45)' }}>…</div>
       : books.length === 0 ? <p style={empty}>{t('notes', 'empty')}</p>
       : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {books.map(book => {
            const title = lang === 'zh' ? (book.title_zh || book.title_en) : (book.title_en || book.title_zh)
            return (
              <button key={book.id} onClick={() => navigate(`/notes/${book.id}`)} style={row}>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>{title}</div>
                  {book.author_en && (
                    <div style={{ color: 'rgba(200,210,235,0.5)', fontSize: '0.8rem', marginTop: '2px' }}>
                      {book.author_en}
                    </div>
                  )}
                </div>
                <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: '1.1rem' }}>›</span>
              </button>
            )
          })}
        </div>
       )}
    </div>
  )
}

const h2    = { fontSize: '1.6rem', fontWeight: 700, color: '#fff', margin: '0 0 0.4rem' }
const empty = { color: 'rgba(200,205,225,0.6)', fontStyle: 'italic' }
const row   = {
  display: 'flex', alignItems: 'center', gap: '0.75rem',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '10px', padding: '0.75rem 1rem',
  cursor: 'pointer', width: '100%', transition: 'background 0.15s',
}
