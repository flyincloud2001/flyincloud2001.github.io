import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useLang } from '../context/LangContext'

const PAGE_SIZE = 10
const MAX_PAGES = 10

export default function Notes() {
  const { t }    = useLang()
  const navigate = useNavigate()
  const [books, setBooks]     = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage]       = useState(1)

  useEffect(() => {
    supabase
      .from('books')
      .select('id, title_zh, title_en, updated_at, created_at')
      .eq('published', true)
      .order('updated_at', { ascending: false })
      .then(({ data }) => { setBooks(data ?? []); setLoading(false) })
  }, [])

  const totalPages = Math.min(Math.ceil(books.length / PAGE_SIZE), MAX_PAGES)
  const paginated  = books.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const fmtDate = book => {
    const raw = book.updated_at || book.created_at
    if (!raw) return ''
    return new Date(raw).toLocaleDateString('zh-TW', {
      year: 'numeric', month: '2-digit', day: '2-digit',
    })
  }

  return (
    <div style={{ padding: '0 clamp(1.25rem, 5vw, 2rem) 0 clamp(1.25rem, 5.3vw, 64px)' }}>
      <style>{`
        .notes-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          cursor: pointer;
          padding: 0.75rem 0.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          border-radius: 4px;
          transition: background 0.15s;
        }
        .notes-row:hover { background: rgba(255,255,255,0.03); }
        .notes-title {
          font-size: 0.97rem;
          font-weight: 500;
          color: #e2e8f0;
          transition: color 0.2s, text-shadow 0.2s;
          text-align: left;
        }
        .notes-row:hover .notes-title {
          color: #93c5fd;
          text-shadow: 0 0 10px rgba(96,165,250,0.55), 0 0 22px rgba(96,165,250,0.25);
        }
        .notes-date {
          font-size: 0.78rem;
          color: rgba(200,210,235,0.38);
          white-space: nowrap;
          margin-left: 2rem;
          flex-shrink: 0;
        }
        .pg-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 5px;
          color: rgba(200,210,235,0.55);
          cursor: pointer;
          min-width: 32px;
          height: 30px;
          font-size: 0.8rem;
          transition: background 0.15s, color 0.15s;
          padding: 0 6px;
        }
        .pg-btn:hover { background: rgba(255,255,255,0.08); color: #fff; }
        .pg-btn.active {
          background: rgba(37,99,235,0.45);
          border-color: rgba(37,99,235,0.5);
          color: #fff;
        }
        .pg-next {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 5px;
          color: rgba(200,210,235,0.65);
          cursor: pointer;
          padding: 0 14px;
          height: 30px;
          font-size: 0.8rem;
          transition: background 0.15s;
        }
        .pg-next:hover { background: rgba(255,255,255,0.11); }
        @media (max-width: 600px) {
          .notes-row { flex-direction: column; align-items: flex-start; gap: 0.2rem; }
          .notes-date { margin-left: 0; }
        }
      `}</style>

      {t('notes', 'title') && <h2 style={h2}>{t('notes', 'title')}</h2>}
      <p style={{ color: 'rgba(200,210,235,0.55)', marginBottom: '2rem', fontSize: '0.88rem' }}>
        {t('notes', 'subtitle')}
      </p>

      {loading
        ? <div style={{ color: 'rgba(200,205,225,0.45)' }}>…</div>
        : books.length === 0
          ? <p style={empty}>{t('notes', 'empty')}</p>
          : (
            <>
              <div>
                {paginated.map(book => (
                  <div
                    key={book.id}
                    className="notes-row"
                    onClick={() => navigate(`/notes/${book.id}`)}
                  >
                    <span className="notes-title">{book.title_zh || book.title_en}</span>
                    <span className="notes-date">{fmtDate(book)}</span>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '1.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      className={`pg-btn${p === page ? ' active' : ''}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                  {page < totalPages && (
                    <button className="pg-next" onClick={() => setPage(p => p + 1)}>
                      下一頁 →
                    </button>
                  )}
                </div>
              )}
            </>
          )
      }
    </div>
  )
}

const h2    = { fontSize: '1.6rem', fontWeight: 700, color: '#fff', margin: '0 0 0.4rem' }
const empty = { color: 'rgba(200,205,225,0.6)', fontStyle: 'italic' }
