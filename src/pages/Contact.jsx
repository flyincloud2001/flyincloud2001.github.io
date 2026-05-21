import { useState } from 'react'
import { supabase, SUPABASE_URL } from '../lib/supabase'
import { useLang } from '../context/LangContext'

export default function Contact() {
  const { t } = useLang()
  const [form, setForm]     = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const set = key => e => setForm(prev => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')

    const { error: dbErr } = await supabase.from('contacts').insert({
      name: form.name, email: form.email, message: form.message,
    })

    if (dbErr) { setStatus('error'); return }

    try {
      await fetch(`${SUPABASE_URL}/functions/v1/send-contact-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    } catch {}

    setStatus('success')
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <div style={{ maxWidth: '560px', padding: '0 clamp(1.25rem, 5vw, 2rem) 0 clamp(1.25rem, 5.3vw, 64px)' }}>
      <h2 style={headingStyle}>{t('contact', 'title')}</h2>

      {status === 'success' ? (
        <p style={{ color: '#86efac', fontSize: '0.95rem' }}>{t('contact', 'success')}</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <input
            type="text" value={form.name} onChange={set('name')} required
            placeholder={t('contact', 'namePh')} style={inputStyle}
          />
          <input
            type="email" value={form.email} onChange={set('email')} required
            placeholder={t('contact', 'emailPh')} style={inputStyle}
          />
          <textarea
            value={form.message} onChange={set('message')} required rows={5}
            placeholder={t('contact', 'msgPh')} style={{ ...inputStyle, resize: 'vertical' }}
          />
          {status === 'error' && (
            <p style={{ color: '#f87171', fontSize: '0.85rem', margin: 0 }}>{t('contact', 'error')}</p>
          )}
          <button
            type="submit" disabled={status === 'sending'}
            style={{
              background: status === 'sending' ? 'rgba(100,120,200,0.25)' : 'rgba(100,120,200,0.55)',
              border: '1px solid rgba(100,120,200,0.3)', borderRadius: '8px',
              color: '#fff', cursor: status === 'sending' ? 'not-allowed' : 'pointer',
              padding: '0.65rem', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.02em',
              transition: 'background 0.2s',
            }}
          >
            {status === 'sending' ? '…' : t('contact', 'send')}
          </button>
        </form>
      )}

    </div>
  )
}

const headingStyle = { fontSize: '1.6rem', fontWeight: 700, color: '#fff', margin: '0 0 1.5rem' }
const inputStyle = {
  width: '100%',
  minWidth: '0',
  boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px', padding: '0.65rem 0.85rem',
  color: '#dde1ec', fontSize: '0.9rem', outline: 'none',
}
