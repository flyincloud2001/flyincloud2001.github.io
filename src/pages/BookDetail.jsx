import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useLang } from '../context/LangContext'

export default function BookDetail() {
  const { id }      = useParams()
  const navigate    = useNavigate()
  const { t, lang } = useLang()

  const [book, setBook]             = useState(null)
  const [comments, setComments]     = useState([])
  const [content, setContent]       = useState('')
  const [nickname, setNickname]     = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('books').select('*').eq('id', id).single(),
      supabase.from('comments').select('*').eq('book_id', id).order('created_at', { ascending: false }),
    ]).then(([{ data: b }, { data: c }]) => {
      setBook(b)
      setComments(c ?? [])
      setLoading(false)
    })
  }, [id])

  const submitComment = async () => {
    if (!content.trim()) return
    setSubmitting(true)

    const { data, error } = await supabase
      .from('comments')
      .insert({ book_id: id, content: content.trim(), nickname: nickname.trim() })
      .select()
      .single()

    if (!error && data) {
      setComments(prev => [data, ...prev])
      setContent('')
      setNickname('')
    }
    setSubmitting(false)
  }

  if (loading) return <div style={{ color: 'rgba(200,205,225,0.45)' }}>…</div>
  if (!book)   return <p style={{ color: '#f87171' }}>Not found.</p>

  const title  = lang === 'zh' ? (book.title_zh  || book.title_en)  : (book.title_en  || book.title_zh)
  const review = book.content ?? ''

  return (
    <div style={{ padding: '0 clamp(1.25rem, 5vw, 2rem) 0 clamp(1.25rem, 5.3vw, 64px)' }}>
      <button onClick={() => navigate('/notes')} style={backBtn}>{t('notes', 'back')}</button>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 0.35rem', color: '#fff', fontSize: '1.5rem', fontWeight: 700 }}>{title}</h2>
        {book.author_en && (
          <p style={{ margin: 0, color: 'rgba(200,210,235,0.5)', fontSize: '0.85rem' }}>{book.author_en}</p>
        )}
      </div>

      {/* Review */}
      <div style={{ lineHeight: 1.9, color: 'rgba(218,222,240,0.88)', fontSize: '0.94rem', marginBottom: '2.5rem', whiteSpace: 'pre-wrap' }}>
        {review || '—'}
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)', marginBottom: '2rem' }} />

      {/* Comments */}
      <h3 style={{ margin: '0 0 1.1rem', color: '#fff', fontSize: '1.05rem', fontWeight: 600 }}>
        {t('notes', 'commentTitle')}
      </h3>

      {/* Comment form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          placeholder={lang === 'zh' ? '暱稱（選填，留空顯示「匿名」）' : 'Nickname (optional, blank = Anonymous)'}
          style={inputSm}
        />
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={t('notes', 'commentPh')}
            rows={3}
            style={textarea}
          />
          <button
            onClick={submitComment}
            disabled={submitting || !content.trim()}
            style={submitBtn(submitting || !content.trim())}
          >
            {t('notes', 'commentBtn')}
          </button>
        </div>
      </div>

      {/* Comment list */}
      {comments.length === 0 ? (
        <p style={{ color: 'rgba(200,205,225,0.42)', fontStyle: 'italic', fontSize: '0.87rem' }}>
          {t('notes', 'noComments')}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {comments.map(c => (
            <div key={c.id} style={commentCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(200,215,240,0.65)' }}>
                  {c.nickname?.trim() || (lang === 'zh' ? '匿名' : 'Anonymous')}
                </span>
                <span style={{ fontSize: '0.74rem', color: 'rgba(200,210,235,0.35)' }}>
                  {new Date(c.created_at).toLocaleString()}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.91rem', color: 'rgba(218,222,240,0.85)', lineHeight: 1.65 }}>
                {c.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const backBtn = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'rgba(200,210,235,0.55)', fontSize: '0.86rem', padding: 0,
  marginBottom: '0.75rem', display: 'block',
}
const inputSm = {
  width: '100%',
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '7px', padding: '7px 10px', color: '#dde1ec', fontSize: '0.86rem', outline: 'none',
}
const textarea = {
  flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px', padding: '0.65rem', color: '#dde1ec', fontSize: '0.9rem',
  resize: 'vertical', outline: 'none',
}
const submitBtn = disabled => ({
  background: disabled ? 'rgba(80,100,180,0.2)' : 'rgba(80,100,180,0.55)',
  border: '1px solid rgba(80,100,180,0.3)', borderRadius: '8px',
  color: disabled ? 'rgba(255,255,255,0.32)' : '#fff',
  cursor: disabled ? 'not-allowed' : 'pointer',
  padding: '0 1.1rem', fontSize: '0.87rem', alignSelf: 'flex-end', height: '42px',
  transition: 'background 0.2s',
})
const commentCard = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '8px', padding: '0.75rem 1rem',
}
