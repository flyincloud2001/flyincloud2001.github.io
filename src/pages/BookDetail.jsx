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

  const titleZh  = book.title_zh || book.title_en
  const titleEn  = book.title_en || ''
  const sections = Array.isArray(book.sections) ? book.sections : []
  const keywords = book.keywords ? book.keywords.split(',').map(k => k.trim()).filter(Boolean) : []

  return (
    <div style={{ padding: '0 clamp(1.25rem, 5vw, 2rem) 0 clamp(1.25rem, 5.3vw, 64px)' }}>
      <button onClick={() => navigate('/notes')} style={backBtn}>{t('notes', 'back')}</button>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 0.25rem', color: '#fff', fontSize: '1.55rem', fontWeight: 700 }}>
          {titleZh}
        </h2>
        {titleEn && titleEn !== titleZh && (
          <p style={{ margin: '0 0 0.5rem', color: 'rgba(200,210,235,0.45)', fontSize: '1rem', fontStyle: 'italic' }}>
            {titleEn}
          </p>
        )}
        {(book.author_zh || book.author_en) && (
          <p style={{ margin: 0, color: 'rgba(200,210,235,0.5)', fontSize: '0.87rem' }}>
            {book.author_zh}{book.author_zh && book.author_en ? '　' : ''}{book.author_en}
          </p>
        )}
      </div>

      {/* Keywords */}
      {keywords.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <SectionLabel>{t('notes', 'keywords')}</SectionLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '0.5rem' }}>
            {keywords.map((kw, i) => (
              <span key={i} style={tagStyle}>{kw}</span>
            ))}
          </div>
        </div>
      )}

      {/* Core Concept */}
      {book.core_concept && (
        <div style={{ marginBottom: '1.5rem' }}>
          <SectionLabel>{t('notes', 'coreConcept')}</SectionLabel>
          <p style={bodyText}>{book.core_concept}</p>
        </div>
      )}

      {/* Why I read this */}
      {book.reason_to_read && (
        <div style={{ marginBottom: '1.5rem' }}>
          <SectionLabel>{t('notes', 'reasonToRead')}</SectionLabel>
          <p style={bodyText}>{book.reason_to_read}</p>
        </div>
      )}

      {/* Content Sections */}
      {sections.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          {sections.map((sec, i) => (
            <div key={i} style={sectionCard}>
              {sec.section_title && (
                <h3 style={sectionTitleStyle}>{sec.section_title}</h3>
              )}
              {sec.subsection_title && (
                <h4 style={subsectionTitleStyle}>{sec.subsection_title}</h4>
              )}
              {sec.body && (
                <p style={bodyText}>{sec.body}</p>
              )}
              {sec.quotes && (
                <div style={{ marginTop: '1rem' }}>
                  <span style={inlineLabelStyle}>{t('notes', 'sectionQuotes')}</span>
                  <blockquote style={quoteStyle}>{sec.quotes}</blockquote>
                </div>
              )}
              {sec.questions && (
                <div style={{ marginTop: '0.85rem' }}>
                  <span style={inlineLabelStyle}>{t('notes', 'sectionQuestions')}</span>
                  <p style={{ ...bodyText, color: 'rgba(200,210,235,0.6)', borderLeft: '2px solid rgba(200,210,235,0.15)', paddingLeft: '0.75rem', marginTop: '0.4rem' }}>
                    {sec.questions}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)', marginBottom: '2rem' }} />

      {/* Comments */}
      <h3 style={{ margin: '0 0 1.1rem', color: '#fff', fontSize: '1.05rem', fontWeight: 600 }}>
        {t('notes', 'commentTitle')}
      </h3>

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

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(147,197,253,0.6)', marginBottom: '0.3rem' }}>
      {children}
    </div>
  )
}

const backBtn = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'rgba(200,210,235,0.55)', fontSize: '0.86rem', padding: 0,
  marginBottom: '0.75rem', display: 'block',
}
const bodyText = {
  margin: '0.3rem 0 0', lineHeight: 1.85,
  color: 'rgba(218,222,240,0.82)', fontSize: '0.94rem', whiteSpace: 'pre-wrap',
}
const tagStyle = {
  background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.22)',
  borderRadius: '20px', padding: '2px 10px', fontSize: '0.78rem',
  color: 'rgba(147,197,253,0.85)',
}
const sectionCard = {
  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '10px', padding: '1.2rem 1.3rem', marginBottom: '1rem',
}
const sectionTitleStyle = {
  margin: '0 0 0.3rem', fontSize: '1.05rem', fontWeight: 700, color: '#e2e8f0',
}
const subsectionTitleStyle = {
  margin: '0 0 0.5rem', fontSize: '0.9rem', fontWeight: 600,
  color: 'rgba(200,210,235,0.6)',
}
const inlineLabelStyle = {
  display: 'block', fontSize: '0.7rem', fontWeight: 600,
  letterSpacing: '0.07em', textTransform: 'uppercase',
  color: 'rgba(147,197,253,0.5)', marginBottom: '0.3rem',
}
const quoteStyle = {
  margin: '0.4rem 0 0', borderLeft: '3px solid rgba(96,165,250,0.4)',
  paddingLeft: '0.85rem', color: 'rgba(218,222,240,0.75)',
  fontSize: '0.93rem', lineHeight: 1.8, fontStyle: 'italic', whiteSpace: 'pre-wrap',
}
const inputSm = {
  width: '100%',
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '7px', padding: '7px 10px', color: '#dde1ec', fontSize: '0.86rem', outline: 'none',
  boxSizing: 'border-box',
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
