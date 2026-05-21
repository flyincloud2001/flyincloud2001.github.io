import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'

const TABS = ['tabProjects', 'tabBooks', 'tabPhotos', 'tabContacts']

export default function Admin() {
  const { user, isAdmin, loading, signIn } = useAuth()
  const { t } = useLang()
  const [tab, setTab] = useState('tabProjects')

  if (loading) return <Spin />

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <h2 style={h2}>{t('auth', 'loginTitle')}</h2>
        <p style={{ color: 'rgba(200,210,235,0.5)', marginBottom: '1.5rem', fontSize: '0.87rem' }}>
          {t('auth', 'loginNote')}
        </p>
        <button onClick={signIn} style={googleBtnStyle}>
          <GoogleIcon /> {t('auth', 'loginBtn')}
        </button>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <p style={{ color: '#f87171', marginBottom: '0.5rem' }}>{t('auth', 'noAccess')}</p>
        <p style={{ color: 'rgba(200,210,235,0.45)', fontSize: '0.83rem' }}>{user.email}</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '0 clamp(1.25rem, 5vw, 2rem) 0 clamp(1.25rem, 5.3vw, 64px)' }}>
      <h2 style={h2}>{t('admin', 'title')}</h2>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {TABS.map(k => (
          <button key={k} onClick={() => setTab(k)} style={tabBtn(tab === k)}>{t('admin', k)}</button>
        ))}
      </div>
      {tab === 'tabProjects' && <ProjectsAdmin t={t} />}
      {tab === 'tabBooks'    && <BooksAdmin    t={t} />}
      {tab === 'tabPhotos'   && <PhotosAdmin   t={t} />}
      {tab === 'tabContacts' && <ContactsAdmin t={t} />}
    </div>
  )
}

/* ─── Projects ─────────────────────────────────────────── */
function ProjectsAdmin({ t }) {
  const [items, setItems] = useState([])
  const [form, setForm]   = useState(null)
  const [saving, setSaving] = useState(false)

  const load = () => supabase.from('projects').select('*').order('created_at', { ascending: false })
    .then(({ data }) => setItems(data ?? []))
  useEffect(() => { load() }, [])

  const blank = { title: '', description: '', pdf_url: '' }

  const save = async () => {
    setSaving(true)
    const payload = { title: form.title, description: form.description, pdf_url: form.pdf_url }
    if (form.id) await supabase.from('projects').update(payload).eq('id', form.id)
    else         await supabase.from('projects').insert(payload)
    await load(); setForm(null); setSaving(false)
  }

  const del = async id => {
    if (!window.confirm(t('admin', 'confirmDelete'))) return
    await supabase.from('projects').delete().eq('id', id); await load()
  }

  return (
    <CRUDPanel
      items={items} form={form} setForm={setForm}
      blank={blank} save={save} del={del} saving={saving} t={t}
      label={item => item.title}
    >
      <TF label="Title"       val={form?.title}       set={v => setForm(p => ({ ...p, title: v }))} />
      <TA label="Description" val={form?.description} set={v => setForm(p => ({ ...p, description: v }))} />
      <TF label="PDF URL"     val={form?.pdf_url}     set={v => setForm(p => ({ ...p, pdf_url: v }))} />
    </CRUDPanel>
  )
}

/* ─── Books ────────────────────────────────────────────── */
function BooksAdmin({ t }) {
  const [items, setItems] = useState([])
  const [form, setForm]   = useState(null)
  const [saving, setSaving] = useState(false)

  const load = () => supabase.from('books').select('*').order('created_at', { ascending: false })
    .then(({ data }) => setItems(data ?? []))
  useEffect(() => { load() }, [])

  const blank = { title_zh: '', title_en: '', author_zh: '', author_en: '', content: '' }

  const save = async () => {
    setSaving(true)
    const payload = {
      title_zh: form.title_zh, title_en: form.title_en,
      author_zh: form.author_zh, author_en: form.author_en,
      content: form.content,
    }
    if (form.id) await supabase.from('books').update(payload).eq('id', form.id)
    else         await supabase.from('books').insert(payload)
    await load(); setForm(null); setSaving(false)
  }

  const del = async id => {
    if (!window.confirm(t('admin', 'confirmDelete'))) return
    await supabase.from('books').delete().eq('id', id); await load()
  }

  return (
    <CRUDPanel
      items={items} form={form} setForm={setForm}
      blank={blank} save={save} del={del} saving={saving} t={t}
      label={item => item.title_zh || item.title_en}
    >
      <TF label={t('admin', 'titleZh')}    val={form?.title_zh}  set={v => setForm(p => ({ ...p, title_zh: v }))} />
      <TF label={t('admin', 'titleEn')}    val={form?.title_en}  set={v => setForm(p => ({ ...p, title_en: v }))} />
      <TF label="作者（中文）"               val={form?.author_zh} set={v => setForm(p => ({ ...p, author_zh: v }))} />
      <TF label={t('admin', 'author')}     val={form?.author_en} set={v => setForm(p => ({ ...p, author_en: v }))} />
      <TA label="Review"                   val={form?.content}   set={v => setForm(p => ({ ...p, content: v }))} rows={8} />
    </CRUDPanel>
  )
}

/* ─── Photos ───────────────────────────────────────────── */
function PhotosAdmin({ t }) {
  const [photos, setPhotos]     = useState([])
  const [uploading, setUploading] = useState(false)
  const [edits, setEdits]       = useState({})
  const fileRef = useRef(null)

  const load = () => supabase.from('photos').select('*').order('created_at', { ascending: false })
    .then(({ data }) => setPhotos(data ?? []))
  useEffect(() => { load() }, [])

  const upload = async e => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const path = `photos/${Date.now()}-${file.name.replace(/\s+/g, '_')}`
    const { data, error } = await supabase.storage.from('pw-photos').upload(path, file)
    if (!error && data) {
      const { data: { publicUrl } } = supabase.storage.from('pw-photos').getPublicUrl(data.path)
      await supabase.from('photos').insert({ url: publicUrl })
      await load()
    }
    setUploading(false)
    e.target.value = ''
  }

  const saveCaption = async id => {
    const e = edits[id] ?? {}
    const orig = photos.find(p => p.id === id)
    await supabase.from('photos').update({
      caption: e.caption ?? orig?.caption ?? '',
    }).eq('id', id)
    await load()
  }

  const del = async (id, url) => {
    if (!window.confirm(t('admin', 'confirmDelete'))) return
    const path = url.split('/photos/')[1]
    if (path) await supabase.storage.from('pw-photos').remove([path])
    await supabase.from('photos').delete().eq('id', id)
    await load()
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          style={{ ...addBtnStyle, opacity: uploading ? 0.5 : 1 }}>
          {uploading ? t('admin', 'uploading') : t('admin', 'uploadPhoto')}
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={upload} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))', gap: '1rem' }}>
        {photos.map(p => (
          <div key={p.id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '0.75rem', border: '1px solid rgba(255,255,255,0.07)' }}>
            <img src={p.url} alt="" style={{ width: '100%', height: '125px', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.5rem' }} />
            <input placeholder="Caption" defaultValue={p.caption}
              onChange={e => setEdits(prev => ({ ...prev, [p.id]: { ...prev[p.id], caption: e.target.value } }))}
              style={{ ...miniIn, marginBottom: '4px' }} />
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
              <button onClick={() => saveCaption(p.id)} style={sBtn('#1d4ed8')}>{t('admin', 'save')}</button>
              <button onClick={() => del(p.id, p.url)}  style={sBtn('#b91c1c')}>{t('admin', 'delete')}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Contacts ─────────────────────────────────────────── */
function ContactsAdmin({ t }) {
  const [items, setItems]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('contacts').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setItems(data ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const del = async id => {
    if (!window.confirm(t('admin', 'confirmDelete'))) return
    await supabase.from('contacts').delete().eq('id', id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  if (loading) return <Spin />
  if (items.length === 0) return <p style={{ color: 'rgba(200,205,225,0.5)', fontStyle: 'italic' }}>{t('admin', 'noContacts')}</p>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
      {items.map(c => (
        <div key={c.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '0.85rem 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontWeight: 600, color: '#dde1ec', fontSize: '0.88rem' }}>{c.name} &lt;{c.email}&gt;</span>
            <button onClick={() => del(c.id)} style={{ ...sBtn('#b91c1c'), fontSize: '0.75rem', padding: '2px 9px' }}>{t('admin', 'delete')}</button>
          </div>
          <p style={{ margin: '0 0 0.3rem', color: 'rgba(218,222,240,0.78)', fontSize: '0.87rem', lineHeight: 1.65 }}>{c.message}</p>
          <span style={{ fontSize: '0.73rem', color: 'rgba(200,210,235,0.38)' }}>{new Date(c.created_at).toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Shared ───────────────────────────────────────────── */
function CRUDPanel({ items, form, setForm, blank, save, del, saving, t, label, children }) {
  return (
    <div>
      <button onClick={() => setForm(blank)} style={addBtnStyle}>{t('admin', 'add')}</button>
      {form && (
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '1.2rem', marginBottom: '1.2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {children}
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.4rem' }}>
              <button onClick={save}            disabled={saving} style={sBtn('#1d4ed8')}>{saving ? '…' : t('admin', 'save')}</button>
              <button onClick={() => setForm(null)}               style={sBtn('#374151')}>{t('admin', 'cancel')}</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
        {items.map(item => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '0.55rem 0.9rem' }}>
            <span style={{ color: 'rgba(218,222,240,0.82)', fontSize: '0.88rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label(item)}</span>
            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
              <button onClick={() => setForm(item)}  style={sBtn('#1d4ed8')}>{t('admin', 'edit')}</button>
              <button onClick={() => del(item.id)}   style={sBtn('#b91c1c')}>{t('admin', 'delete')}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TF({ label, val, set }) {
  return (
    <div>
      <label style={lbl}>{label}</label>
      <input value={val ?? ''} onChange={e => set(e.target.value)} style={inp} />
    </div>
  )
}

function TA({ label, val, set, rows = 4 }) {
  return (
    <div>
      <label style={lbl}>{label}</label>
      <textarea value={val ?? ''} onChange={e => set(e.target.value)} rows={rows} style={{ ...inp, resize: 'vertical' }} />
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginRight: '8px', flexShrink: 0 }}>
      <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/>
      <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/>
      <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/>
      <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.31z"/>
    </svg>
  )
}

function Spin() { return <div style={{ color: 'rgba(200,205,225,0.45)' }}>…</div> }

const h2            = { fontSize: '1.6rem', fontWeight: 700, color: '#fff', margin: '0 0 1.2rem' }
const tabBtn = on => ({
  background: on ? 'rgba(37,99,235,0.45)' : 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px',
  color: on ? '#fff' : 'rgba(200,210,235,0.65)', cursor: 'pointer',
  padding: '5px 13px', fontSize: '0.84rem',
})
const addBtnStyle   = { background: 'rgba(37,99,235,0.45)', border: '1px solid rgba(37,99,235,0.35)', borderRadius: '7px', color: '#fff', cursor: 'pointer', padding: '6px 16px', fontSize: '0.87rem', marginBottom: '0.85rem' }
const sBtn = bg  => ({ background: bg, border: 'none', borderRadius: '5px', color: '#fff', cursor: 'pointer', padding: '5px 12px', fontSize: '0.81rem' })
const lbl           = { display: 'block', color: 'rgba(200,210,235,0.55)', fontSize: '0.76rem', marginBottom: '4px', letterSpacing: '0.03em' }
const inp           = { width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '7px', padding: '7px 10px', color: '#dde1ec', fontSize: '0.87rem', outline: 'none', boxSizing: 'border-box' }
const miniIn        = { width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '5px', padding: '5px 8px', color: '#dde1ec', fontSize: '0.77rem', outline: 'none', boxSizing: 'border-box' }
const googleBtnStyle = { display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '8px', color: '#fff', cursor: 'pointer', padding: '10px 20px', fontSize: '0.93rem', fontWeight: 500 }
