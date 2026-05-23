import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { useLang } from '../context/LangContext'
import { supabase } from '../lib/supabase'

const FALLBACK = {
  zh: '我是多倫多大學學生，專修於數學和物理，我的興趣廣泛，一言難盡。我喜歡閱讀一些書籍，並留下我對該書籍的想法。歡迎瀏覽我的想法並留下你寶貴的評論，謝謝!',
  en: 'I am a student at the University of Toronto, majoring in Mathematics and Physics. My interests are wide and hard to summarize. I enjoy reading books and leaving my thoughts on them. Feel free to browse my ideas and leave your valuable comments. Thank you!',
}

export default function About() {
  const { t, lang }  = useLang()
  const subtitleRef  = useRef(null)
  const [subtitles, setSubtitles] = useState({ zh: FALLBACK.zh, en: FALLBACK.en })

  useEffect(() => {
    supabase.from('site_settings').select('value_zh,value_en').eq('id', 'about_subtitle').single()
      .then(({ data }) => {
        if (data) setSubtitles({ zh: data.value_zh || FALLBACK.zh, en: data.value_en || FALLBACK.en })
      })
  }, [])

  const subtitle = subtitles[lang] ?? FALLBACK[lang]

  useEffect(() => {
    const el = subtitleRef.current
    if (!el) return
    el.textContent = ''
    const obj = { n: 0 }
    const tween = gsap.to(obj, {
      n: subtitle.length,
      duration: subtitle.length * 0.032,
      ease: 'none',
      onUpdate() {
        el.textContent = subtitle.slice(0, Math.round(obj.n))
      },
    })
    return () => tween.kill()
  }, [subtitle])

  return (
    <div style={{
      padding: '1rem clamp(1rem, 5vw, 2rem) 2rem clamp(1rem, 5.3vw, 64px)',
    }}>
      <h1 style={{
        fontSize: 'clamp(2.2rem, 6vw, 4.2rem)',
        fontWeight: 700,
        color: '#fff',
        margin: '0 0 1.4rem',
        letterSpacing: '-0.02em',
        lineHeight: 1.1,
        textAlign: 'left',
        textShadow: '0 2px 24px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.9)',
      }}>
        {t('about', 'title')}
      </h1>

      <p
        ref={subtitleRef}
        style={{
          fontSize: 'clamp(0.95rem, 2.1vw, 1.12rem)',
          lineHeight: 1.85,
          color: 'rgba(230,236,255,0.92)',
          maxWidth: '580px',
          margin: '0 0 1.1rem',
          textAlign: 'left',
          textShadow: '0 1px 10px rgba(0,0,0,0.75), 0 1px 2px rgba(0,0,0,0.85)',
          minHeight: '1.2em',
          whiteSpace: 'pre-wrap',
        }}
      />

      <p style={{
        fontSize: 'clamp(0.88rem, 2vw, 1rem)',
        color: 'rgba(200,210,240,0.75)',
        margin: 0,
        textShadow: '0 1px 8px rgba(0,0,0,0.75)',
      }}>
        Here is my{' '}
        <a
          href="https://fosterteng.com/assets/cv.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'rgba(160,185,255,0.9)', textDecoration: 'underline' }}
        >
          CV
        </a>
        .
      </p>
    </div>
  )
}
