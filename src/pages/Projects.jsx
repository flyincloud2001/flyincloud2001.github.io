import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useLang } from '../context/LangContext'

export default function Projects() {
  const { t, lang } = useLang()
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setProjects(data ?? []); setLoading(false) })
  }, [])

  return (
    <div style={{ paddingLeft: '64px' }}>
      <h2 style={h2}>{t('projects', 'title')}</h2>

      {loading ? <Spinner /> : projects.length === 0 ? (
        <p style={empty}>{t('projects', 'empty')}</p>
      ) : (
        <div style={{ display: 'grid', gap: '1.1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {projects.map(p => <ProjectCard key={p.id} p={p} lang={lang} />)}
        </div>
      )}
    </div>
  )
}

function ProjectCard({ p, lang }) {
  const title = pick(lang, p.title_zh, p.title_en)
  const desc  = pick(lang, p.description_zh, p.description_en)
  return (
    <div style={card}>
      <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', color: '#fff', fontWeight: 600 }}>{title}</h3>
      {desc && <p style={{ margin: '0 0 0.75rem', fontSize: '0.88rem', color: 'rgba(210,215,235,0.78)', lineHeight: 1.65 }}>{desc}</p>}
      {p.url && (
        <a href={p.url} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: '0.82rem', color: '#6ea8fe', textDecoration: 'none' }}>
          View →
        </a>
      )}
    </div>
  )
}

const pick = (lang, zh, en) => lang === 'zh' ? (zh || en) : (en || zh)
const h2   = { fontSize: '1.6rem', fontWeight: 700, color: '#fff', margin: '0 0 1.5rem' }
const empty = { color: 'rgba(200,205,225,0.6)', fontStyle: 'italic' }
const card  = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '1rem' }
function Spinner() { return <div style={{ color: 'rgba(200,205,225,0.45)' }}>…</div> }
